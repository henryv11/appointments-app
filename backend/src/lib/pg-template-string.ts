export default Object.assign(sql, { where, set, columns, values, raw });

const PLACEHOLDER = '?';

const PREFIX_PLACEHOLDER = '$';

const sqlObjControlsSymbol = Symbol('controls');

enum SqlObjType {
  MAIN,
  WHERE,
  SET,
  VALUES,
  COLUMNS,
  RAW,
}

const isSqlObject = (obj: unknown): obj is SqlObjBase => (obj as SqlObj)?.[sqlObjControlsSymbol] !== undefined;
const isColumnsSqlObjectControl = (obj: SqlObjControl): obj is SqlObjControl<SqlObjType.COLUMNS> =>
  obj.type === SqlObjType.COLUMNS;

function sqlObjectControl<T extends SqlObjType>(type: T) {
  const values: ValidArg[] = [];
  const text: string[] = [];
  const sqlObj = {
    get isEmpty() {
      return !text.some(Boolean);
    },
    type,
    text,
    values,
  };
  return sqlObj;
}

function mergeColumnsSqlObjects(dest: SqlObjControl, source: SqlObjControl<SqlObjType.COLUMNS>) {
  const prefix = source.prefix || (isColumnsSqlObjectControl(dest) && dest.prefix);
  source.text.forEach(txt => {
    if (txt === PREFIX_PLACEHOLDER) prefix && dest.text.push(prefix + '.');
    else dest.text.push(txt);
  });
}

function mergeSqlObjects(dest: SqlObjControl, source: SqlObjControl) {
  if (source.isEmpty) return;
  if (source.type === SqlObjType.WHERE) dest.text.push('WHERE ', ...source.text);
  else if (source.type === SqlObjType.SET) dest.text.push('SET ', ...source.text);
  else if (source.type === SqlObjType.VALUES) dest.text.push('VALUES ', ...source.text);
  else if (isColumnsSqlObjectControl(source)) mergeColumnsSqlObjects(dest, source);
  else dest.text.push(...source.text);
  dest.values.push(...source.values);
}

function templateStringParserLoop(
  tempStrs: TemplateStringsArray,
  args: (ValidArg | SqlObjBase | undefined)[] = [],
  sqlObj: SqlObjControl,
) {
  for (let i = 0, currArg; i < tempStrs.length; i++) {
    currArg = args[i];
    sqlObj.text.push(tempStrs[i]);
    if (currArg === undefined) continue;
    if (isSqlObject(currArg)) mergeSqlObjects(sqlObj, currArg[sqlObjControlsSymbol]);
    else sqlObj.values.push(currArg), sqlObj.text.push(PLACEHOLDER);
  }
}

function where(): WhereSqlObj;
function where(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]): WhereSqlObj;
function where(tempStrs?: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]): WhereSqlObj {
  const control = sqlObjectControl(SqlObjType.WHERE);
  const sqlObj: WhereSqlObj = {
    [sqlObjControlsSymbol]: control,
    and(tempStrs, ...args) {
      if (!control.isEmpty) control.text.push(' AND ');
      templateStringParserLoop(tempStrs, args, control);
      return sqlObj;
    },
    or(tempStrs, ...args) {
      if (!control.isEmpty) control.text.push(' OR ');
      templateStringParserLoop(tempStrs, args, control);
      return sqlObj;
    },
    get isEmpty() {
      return control.isEmpty;
    },
  };
  tempStrs && templateStringParserLoop(tempStrs, args, control);
  return sqlObj;
}

function set(): UpdateSqlObj;
function set(arg1: KeyValuePairs): UpdateSqlObj;
function set(arg1: string, arg2: ValidArg | undefined): UpdateSqlObj;
function set(arg1?: string | KeyValuePairs, arg2?: ValidArg): UpdateSqlObj {
  const control = sqlObjectControl(SqlObjType.SET);
  const sqlObj: UpdateSqlObj = {
    [sqlObjControlsSymbol]: control,
    add(arg1: string | KeyValuePairs, arg2?: ValidArg) {
      ((Array.isArray(arg1) ? arg1 : [[arg1, arg2]]) as KeyValuePairs).forEach(kv => {
        if (kv && kv[1] !== undefined) {
          if (!control.isEmpty) control.text.push(', ');
          control.text.push('"' + kv[0] + '"' + ' = ', PLACEHOLDER);
          control.values.push(kv[1]);
        }
      });
      return sqlObj;
    },
    get isEmpty() {
      return control.isEmpty;
    },
  };
  return arg1 ? sqlObj.add(arg1 as string, arg2) : sqlObj;
}

function values(...rows: ValidArg[][]) {
  const control = sqlObjectControl(SqlObjType.VALUES);
  const sqlObj: ValuesSqlObject = {
    [sqlObjControlsSymbol]: control,
    get isEmpty() {
      return control.isEmpty;
    },
  };
  const rowsLen = rows.length - 1;
  rows.forEach((row, i) => {
    const rowLen = row.length - 1;
    control.text.push('(');
    row.forEach((col, j) => {
      control.text.push(PLACEHOLDER);
      control.values.push(col);
      j < rowLen && control.text.push(', ');
    });
    control.text.push(')' + (i < rowsLen ? ', ' : ''));
  });
  return sqlObj;
}

function columns(columns: (string | [string, string] | ColumnsSqlObject)[], prefix = '') {
  const control = Object.assign(sqlObjectControl(SqlObjType.COLUMNS), { prefix });
  const sqlObj: ColumnsSqlObject = {
    [sqlObjControlsSymbol]: control,
    get isEmpty() {
      return control.isEmpty;
    },
  };
  const len = columns.length - 1;
  columns.forEach((col, i) => {
    if (isSqlObject(col)) mergeSqlObjects(control, col[sqlObjControlsSymbol]);
    else if (Array.isArray(col)) control.text.push(PREFIX_PLACEHOLDER, col[0] + ' AS ' + '"' + col[1] + '"');
    else control.text.push(PREFIX_PLACEHOLDER, col);
    if (i < len) control.text.push(', ');
  });
  return sqlObj;
}

function raw(str: string) {
  const sqlObj: RawSqlObj = {
    [sqlObjControlsSymbol]: sqlObjectControl(SqlObjType.RAW),
  };
  sqlObj[sqlObjControlsSymbol].text.push(str);
  return sqlObj;
}

function sql(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]) {
  const control = sqlObjectControl(SqlObjType.MAIN);
  const sqlObj: SqlObj = {
    [sqlObjControlsSymbol]: control,
    append(...strOrSql) {
      strOrSql.forEach(
        sos => sos && (isSqlObject(sos) ? mergeSqlObjects(control, sos[sqlObjControlsSymbol]) : control.text.push(sos)),
      );
      return sqlObj;
    },
    get isEmpty() {
      return control.isEmpty;
    },
    get text() {
      let i = 0;
      return control.text.map(str => (str === PLACEHOLDER ? (i++, '$' + i) : str)).join('');
    },
    values: control.values,
  };
  templateStringParserLoop(tempStrs, args, control);
  return sqlObj;
}

type ValidArg = string | number | boolean | Date | null;

type KeyValuePairs = ([string, ValidArg | undefined] | undefined | false)[];

type SqlObjControl<T extends SqlObjType = SqlObjType> = {
  values: ValidArg[];
  text: string[];
  readonly isEmpty: boolean;
  type: T;
} & ExtraParams[T];

type ExtraParamsMap = {
  [SqlObjType.COLUMNS]: {
    prefix: string;
  };
};

type ExtraParams = ExtraParamsMap & Record<Exclude<SqlObjType, keyof ExtraParamsMap>, unknown>;

interface SqlObjBase<T extends SqlObjType = SqlObjType> {
  [sqlObjControlsSymbol]: SqlObjControl<T>;
}

interface SqlObj extends SqlObjBase<SqlObjType.MAIN> {
  values: ValidArg[];
  readonly text: string;
  append: (...strOrSql: (string | SqlObjBase | false | undefined)[]) => SqlObj;
  readonly isEmpty: boolean;
}

interface WhereSqlObj extends SqlObjBase<SqlObjType.WHERE> {
  and(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]): WhereSqlObj;
  or(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]): WhereSqlObj;
  readonly isEmpty: boolean;
}

interface ValuesSqlObject extends SqlObjBase<SqlObjType.VALUES> {
  readonly isEmpty: boolean;
}

interface ColumnsSqlObject extends SqlObjBase<SqlObjType.COLUMNS> {
  readonly isEmpty: boolean;
}

interface UpdateSqlObj extends SqlObjBase<SqlObjType.SET> {
  add: UpdateSqlObjAdd;
  readonly isEmpty: boolean;
}

interface RawSqlObj extends SqlObjBase<SqlObjType.RAW> {}

interface UpdateSqlObjAdd {
  (arg1: string | KeyValuePairs): UpdateSqlObj;
  (arg1: string, arg2: ValidArg | undefined): UpdateSqlObj;
}
