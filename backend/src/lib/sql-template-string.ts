const sqlObjControlsSymbol = Symbol('controls');
const isSqlObject = (obj: unknown): obj is SqlObjBase => (obj as SqlObject)?.[sqlObjControlsSymbol] !== undefined;

function mergeSqlObject(obj1: SqlObjControl, obj2: SqlObjControl, reverse = false) {
  switch (obj2.type) {
    case SqlObjType.WHERE: {
      if (!obj2.isEmpty) reverse ? obj1.unshiftText('where ') : obj1.pushText('where ');
    }
    case SqlObjType.SET: {
      if (!obj2.isEmpty) reverse ? obj1.unshiftText('set ') : obj1.pushText('set ');
    }
  }
  if (reverse) obj1.unshiftText(...obj2.text), obj2.unshiftValues(...obj2.values);
  else obj1.pushText(...obj2.text), obj1.pushValues(...obj2.values);
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
  const sqlObj: WhereSqlObject = {
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

function set(): UpdateSqlObject;
function set(arg1: KeyValuePairs): UpdateSqlObject;
function set(arg1: string, arg2: ValidArg): UpdateSqlObject;
function set(arg1?: string | KeyValuePairs, arg2?: ValidArg): UpdateSqlObject {
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
  const sqlObj: UpdateSqlObject = {
    [sqlObjControlsSymbol]: control,
    add(arg1: string | KeyValuePairs, arg2?: ValidArg) {
      pushValues(Array.isArray(arg1) ? arg1 : ([[arg1, arg2]] as [string, ValidArg | undefined][]));
      return sqlObj;
    },
    get isEmpty() {
      return control.isEmpty;
    },
  };
  if (arg1) pushValues(Array.isArray(arg1) ? arg1 : ([[arg1, arg2]] as [string, ValidArg | undefined][]));
  return sqlObj;
}

export default function sql(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]) {
  const control = sqlObjectControl(SqlObjType.MAIN);
  const sqlObj: SqlObject = {
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

type ValidArg = string | number | boolean | Date | null;

enum SqlObjType {
  MAIN,
  WHERE,
  SET,
}

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

interface SqlObject extends SqlObjBase<SqlObjType.MAIN> {
  values: ValidArg[];
  readonly text: string;
  append: (...strOrSql: (string | SqlObjBase | false | undefined)[]) => SqlObject;
  prepend: (...strOrSql: (string | SqlObjBase | false | undefined)[]) => SqlObject;
  readonly isEmpty: boolean;
}

interface WhereSqlObject extends SqlObjBase<SqlObjType.WHERE> {
  and(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]): WhereSqlObject;
  or(tempStrs: TemplateStringsArray, ...args: (ValidArg | SqlObjBase | undefined)[]): WhereSqlObject;
  readonly isEmpty: boolean;
}

interface UpdateSqlObject extends SqlObjBase<SqlObjType.SET> {
  add: UpdateSqlObjectAdd;
  readonly isEmpty: boolean;
}
interface UpdateSqlObjectAdd {
  (arg1: string | KeyValuePairs): UpdateSqlObject;
  (arg1: string, arg2: ValidArg | undefined): UpdateSqlObject;
}

type KeyValuePairs = ([string, ValidArg | undefined] | undefined | false)[];
