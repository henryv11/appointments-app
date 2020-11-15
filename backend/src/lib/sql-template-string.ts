const sqlObjControlsSymbol = Symbol('controls');
const isSqlObject = (obj: unknown): obj is SqlObjBase => (obj as SqlObj)?.[sqlObjControlsSymbol] !== undefined;

function mergeSqlObject(obj1: SqlObjControl, obj2: SqlObjControl, reverse = false) {
  if (!obj2.isEmpty) {
    if (obj2.type === SqlObjType.WHERE) reverse ? obj1.unshiftText('where ') : obj1.pushText('where ');
    else if (obj2.type === SqlObjType.SET) reverse ? obj1.unshiftText('set ') : obj1.pushText('set ');
  }

  reverse
    ? (obj1.unshiftText(...obj2.text), obj2.unshiftValues(...obj2.values))
    : (obj1.pushText(...obj2.text), obj1.pushValues(...obj2.values));
}

function templateStringParserLoop(
  tempStrs: TemplateStringsArray,
  args: (ValidArg | SqlObjBase | undefined)[] = [],
  sqlObj: SqlObjControl,
) {
  for (let i = 0, currArg; i < tempStrs.length; i++) {
    currArg = args[i];
    sqlObj.pushText(tempStrs[i]);
    if (currArg === undefined) continue;
    if (isSqlObject(currArg)) mergeSqlObject(sqlObj, currArg[sqlObjControlsSymbol]);
    else sqlObj.pushValues(currArg), sqlObj.pushText('?');
  }
}

function sqlObjectControl<T extends SqlObjType>(type: T) {
  const values: ValidArg[] = [];
  const text: string[] = [];
  const pushText = (...args: string[]) => text.push(...args);
  const unshiftText = (...args: string[]) => text.unshift(...args);
  const pushValues = (...args: ValidArg[]) => values.push(...args);
  const unshiftValues = (...args: ValidArg[]) => values.unshift(...args);
  const sqlObj: SqlObjControl<T> = {
    get values() {
      return values;
    },
    get text() {
      return text;
    },
    get isEmpty() {
      return !text.some(Boolean);
    },
    type,
    pushValues,
    unshiftValues,
    pushText,
    unshiftText,
  };
  return sqlObj;
}

function where(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]) {
  const control = sqlObjectControl(SqlObjType.WHERE);
  const sqlObj: WhereSqlObj = {
    [sqlObjControlsSymbol]: control,
    and(tempStrs, ...args) {
      if (!control.isEmpty) control.pushText(' and ');
      templateStringParserLoop(tempStrs, args, control);
      return sqlObj;
    },
    or(tempStrs, ...args) {
      if (!control.isEmpty) control.pushText(' or ');
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
  function pushValues(kvPairs: KeyValuePairs) {
    kvPairs.forEach(kv => {
      if (kv && kv[1] !== undefined) {
        if (!control.isEmpty) control.pushText(', ');
        control.pushText(kv[0] + ' = ', '?');
        control.pushValues(kv[1]);
      }
    });
  }
  const sqlObj: UpdateSqlObj = {
    [sqlObjControlsSymbol]: control,
    add(arg1: string | KeyValuePairs, arg2?: ValidArg) {
      pushValues(Array.isArray(arg1) ? arg1 : [[arg1, arg2]]);
      return sqlObj;
    },
    get isEmpty() {
      return control.isEmpty;
    },
  };
  if (arg1) pushValues(Array.isArray(arg1) ? arg1 : [[arg1, arg2]]);
  return sqlObj;
}

export default function sql(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]) {
  const control = sqlObjectControl(SqlObjType.MAIN);
  const sqlObj: SqlObj = {
    [sqlObjControlsSymbol]: control,
    append(...strOrSql) {
      strOrSql.forEach(
        sos => sos && (isSqlObject(sos) ? mergeSqlObject(control, sos[sqlObjControlsSymbol]) : control.pushText(sos)),
      );
      return sqlObj;
    },
    prepend(...strOrSql) {
      strOrSql.forEach(
        sos =>
          sos &&
          (isSqlObject(sos) ? (mergeSqlObject(control, sos[sqlObjControlsSymbol]), true) : control.unshiftText(sos)),
      );
      return sqlObj;
    },
    get isEmpty() {
      return control.isEmpty;
    },
    get text() {
      let i = 0;
      return control.text.map(str => (str === '?' ? (i++, '$' + i) : str)).join('');
    },
    values: control.values,
  };
  templateStringParserLoop(tempStrs, args, control);
  return sqlObj;
}

sql.where = where;
sql.set = set;

enum SqlObjType {
  MAIN,
  WHERE,
  SET,
}

type ValidArg = string | number | boolean | Date | null;

type KeyValuePairs = ([string, ValidArg | undefined] | undefined | false)[];

interface SqlObjControl<T extends SqlObjType = SqlObjType.MAIN | SqlObjType.WHERE | SqlObjType.SET> {
  readonly values: ValidArg[];
  readonly text: string[];
  readonly isEmpty: boolean;
  unshiftValues: (...values: ValidArg[]) => number;
  pushValues: (...values: ValidArg[]) => number;
  pushText: (...text: string[]) => number;
  unshiftText: (...text: string[]) => number;
  type: T;
}

interface SqlObjBase<T extends SqlObjType = SqlObjType.MAIN | SqlObjType.WHERE | SqlObjType.SET> {
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

interface UpdateSqlObj extends SqlObjBase<SqlObjType.SET> {
  add: UpdateSqlObjAdd;
  readonly isEmpty: boolean;
}
interface UpdateSqlObjAdd {
  (arg1: string | KeyValuePairs): UpdateSqlObj;
  (arg1: string, arg2: ValidArg | undefined): UpdateSqlObj;
}
