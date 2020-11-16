const PLACEHOLDER = '?';
const sqlObjControlsSymbol = Symbol('controls');
const isSqlObject = (obj: unknown): obj is SqlObjBase => (obj as SqlObj)?.[sqlObjControlsSymbol] !== undefined;

function sqlObjectControl<T extends SqlObjType>(type: T) {
  const values: ValidArg[] = [];
  const text: string[] = [];
  const sqlObj: SqlObjControl<T> = {
    get isEmpty() {
      return !text.some(Boolean);
    },
    type,
    text,
    values,
  };
  return sqlObj;
}

function mergeSqlObject(obj1: SqlObjControl, obj2: SqlObjControl, reverse = false) {
  if (!obj2.isEmpty) {
    if (obj2.type === SqlObjType.WHERE) reverse ? obj1.text.unshift('WHERE ') : obj1.text.push('WHERE ');
    else if (obj2.type === SqlObjType.SET) reverse ? obj1.text.unshift('SET ') : obj1.text.push('SET ');
    else if (obj2.type === SqlObjType.VALUES) reverse ? obj1.text.unshift('VALUES ') : obj1.text.push('VALUES ');
  }
  reverse
    ? (obj1.text.unshift(...obj2.text), obj2.values.unshift(...obj2.values))
    : (obj1.text.push(...obj2.text), obj1.values.push(...obj2.values));
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
    if (isSqlObject(currArg)) mergeSqlObject(sqlObj, currArg[sqlObjControlsSymbol]);
    else sqlObj.values.push(currArg), sqlObj.text.push(PLACEHOLDER);
  }
}

function where(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]) {
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
  templateStringParserLoop(tempStrs, args, control);
  return sqlObj;
}

function set(): UpdateSqlObj;
function set(arg1: KeyValuePairs): UpdateSqlObj;
function set(arg1: string, arg2: ValidArg): UpdateSqlObj;
function set(arg1?: string | KeyValuePairs, arg2?: ValidArg): UpdateSqlObj {
  const control = sqlObjectControl(SqlObjType.SET);
  const sqlObj: UpdateSqlObj = {
    [sqlObjControlsSymbol]: control,
    add(arg1: string | KeyValuePairs, arg2?: ValidArg) {
      ((Array.isArray(arg1) ? arg1 : [[arg1, arg2]]) as KeyValuePairs).forEach(kv => {
        if (kv && kv[1] !== undefined) {
          if (!control.isEmpty) control.text.push(', ');
          control.text.push(kv[0] + ' = ', PLACEHOLDER);
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
  rows.forEach((row, i) => {
    control.text.push('(');
    row.forEach((col, j) => {
      control.text.push(PLACEHOLDER);
      control.values.push(col);
      j < row.length - 1 && control.text.push(', ');
    });
    control.text.push(')' + (i < rows.length - 1 ? ', ' : ''));
  });
  return sqlObj;
}

function columns(...columns: (string | [string, string])[]) {
  const control = sqlObjectControl(SqlObjType.UTIL);
  const sqlObj: UtilSqlObject = {
    [sqlObjControlsSymbol]: control,
    get isEmpty() {
      return control.isEmpty;
    },
  };
  columns.forEach((col, i) =>
    Array.isArray(col)
      ? control.text.push(col[0] + ' AS ' + '"' + col[1] + '"' + (i < columns.length - 1 ? ', ' : ''))
      : control.text.push(col + (i < columns.length - 1 ? ', ' : '')),
  );
  return sqlObj;
}

function sql(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]) {
  const control = sqlObjectControl(SqlObjType.MAIN);
  const sqlObj: SqlObj = {
    [sqlObjControlsSymbol]: control,
    append(...strOrSql) {
      strOrSql.forEach(
        sos =>
          sos && (isSqlObject(sos) ? mergeSqlObject(control, sos[sqlObjControlsSymbol]) : control.text.unshift(sos)),
      );
      return sqlObj;
    },
    prepend(...strOrSql) {
      strOrSql.forEach(
        sos =>
          sos &&
          (isSqlObject(sos) ? (mergeSqlObject(control, sos[sqlObjControlsSymbol]), true) : control.text.unshift(sos)),
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

export default Object.assign(sql, { where, set, values, columns });

enum SqlObjType {
  MAIN,
  WHERE,
  SET,
  VALUES,
  UTIL,
}

type ValidArg = string | number | boolean | Date | null;

type KeyValuePairs = ([string, ValidArg | undefined] | undefined | false)[];

interface SqlObjControl<T extends SqlObjType = SqlObjType> {
  values: ValidArg[];
  text: string[];
  readonly isEmpty: boolean;
  type: T;
}

interface SqlObjBase<T extends SqlObjType = SqlObjType> {
  [sqlObjControlsSymbol]: SqlObjControl<T>;
}

interface SqlObj extends SqlObjBase<SqlObjType.MAIN> {
  values: ValidArg[];
  readonly text: string;
  append: (...strOrSql: (string | SqlObjBase | false | undefined)[]) => SqlObj;
  prepend: (...strOrSql: (string | SqlObjBase | false | undefined)[]) => SqlObj;
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

interface UtilSqlObject extends SqlObjBase<SqlObjType.UTIL> {
  readonly isEmpty: boolean;
}

interface UpdateSqlObj extends SqlObjBase<SqlObjType.SET> {
  add: UpdateSqlObjAdd;
  readonly isEmpty: boolean;
}
interface UpdateSqlObjAdd {
  (arg1: string | KeyValuePairs): UpdateSqlObj;
  (arg1: string, arg2: ValidArg | undefined): UpdateSqlObj;
}
