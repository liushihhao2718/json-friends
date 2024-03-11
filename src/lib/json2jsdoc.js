let All_Keys = [];
let typedef_comments = []
let levels = []

/**
 * 
 * @param {Object} data 
 * @param {string} key
 */
export default function init(data, key = 'ObjectType') {


  levels.push([key, objectKey(data)])

  console.log(levels)

  while (levels.length > 0) {
    const [k, v] = levels.shift();

    console.log(k, v)
    jsdoc_gen(k, v);
  }
  return typedef_comments.join('\n\n');
}

function jsdoc_gen(k, v) {
  if (isPrimitive(v)) {
    typedef_comments.push(
      [`/**`, ` * @typedef ${k}`,
        ` * @property {${v}}`,
        ` */`].join('\n')
    )
  }
 
  else {

    typedef_comments.push(
      [`/**`, ` * @typedef ${k}`,
        ...Object.entries(v).map(([k_in, v_in]) => {

          if (Array.isArray(v_in)) {
            if (v_in.length == 1) {
              if (isPrimitive(v_in[0])) {
                return ` * @property {${v_in[0]}[]} ${k_in}`;
              }
              else {
                const new_key = firstLetterUpperCase(k_in);
                levels.push([new_key, v_in[0]])
                return ` * @property {${new_key}[]} ${k_in}`;
              }
            }

            else {
              const types = v_in.map(x => {
                if (!isPrimitive(v_in)) {
                  const new_key = firstLetterUpperCase(k_in);
                  levels.push([new_key, v_in])
                  return new_key
                }
                else return x;
              })
              return ` * @property {[${types.join('|')}]} ${k_in}`;
            }

          }
          if (isPrimitive(v_in)) {
            return ` * @property {${v_in}} ${k_in}`;
          }
          else {
            const new_key = firstLetterUpperCase(k_in);
            levels.push([new_key, v_in])
            return ` * @property {${new_key}} ${k_in}`;
          }
        }),
        ` */`].join('\n')
    )
  }
}

function firstLetterUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 
 * @param {object} obj non array object
 * @param {number} depth object parse depth
 */
function objectKey(obj, depth = 0) {
  if (depth > 10) throw Error('object too deep.');

  if (obj === '') return 'string';
  if (!obj) return 'null';
  if (Array.isArray(obj)) {


    /** [] */
    if (obj.length === 0) {
      return 'array'
    }

    const array_result = []
    obj.forEach(o => {
      const key = objectKey(o, depth++)

      if (array_result.find(x => deepEqual(x, key))) return;
      if (!isPrimitive(key)) All_Keys.push(key);
      array_result.push(key)
    })


    return array_result
  }

  const type = typeof obj;
  if (type !== 'object') return type;
  const entries = Object.entries(obj);

  if (entries.length == 0) return 'object';
  const properties = entries.map(x => {
    const [k, v] = x;
    return [k, objectKey(v, depth + 1)]
  })
  return Object.fromEntries(properties);
}


function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}


function isPrimitive(str) {
  return ['string', 'number', 'bigint', 'boolean', 'undefined', 'symbol', 'null', 'object'].includes(str)
}