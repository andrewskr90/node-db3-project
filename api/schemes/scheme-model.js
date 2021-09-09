const db = require('../../data/db-config')

async function find() { 
  const allSteps = await db('schemes as sc')
    .join('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.scheme_id', 'sc.scheme_name', 'st.step_id')
    .orderBy('sc.scheme_id')

  const schemesArray = await db('schemes as sc')
    .select('sc.scheme_id as schemeId', 'sc.scheme_name',)
  
    const stepArray = schemesArray.map(scheme => {

      let schemeStepArray = allSteps.filter(step => {
      return step.scheme_id === scheme.schemeId
      })

      return {
        scheme_id: scheme.schemeId,
        scheme_name: scheme.scheme_name,
        number_of_steps: schemeStepArray.length
      }  
    })
    console.log(stepArray)

  return stepArray

  }
  
  // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */


//     SELECT
//     sc.*,
//     st.step_id, st.step_number, st.instructions
// FROM schemes as sc
// LEFT JOIN steps as st
//     ON sc.scheme_id = st.scheme_id
// WHERE sc.scheme_id = 7
// ORDER BY st.step_number ASC;

async function findById(schemeId) {
    const rawSchemeArray = await db('schemes as sc')
      .leftJoin('steps as st', 'st.scheme_id', 'sc.scheme_id')
      .select('sc.scheme_name',
        'st.step_id',
        'st.step_number',
        'st.instructions',
        'sc.scheme_id')
      .where('sc.scheme_id', schemeId)
      .orderBy('st.step_number')

      const schemeStepArray = rawSchemeArray.map(scheme => {
        return {
          step_id: scheme.step_id,
          step_number: scheme.step_number,
          instructions: scheme.instructions
        }
      })

      if (schemeStepArray[0].step_id === null) {
        const noSteps= {
          scheme_id: rawSchemeArray[0].scheme_id,
          scheme_name: rawSchemeArray[0].scheme_name,
          steps: []
        }

        return noSteps

      } else {
        const formattedScheme = {
          scheme_id: rawSchemeArray[0].scheme_id,
          scheme_name: rawSchemeArray[0].scheme_name,
          steps: schemeStepArray
        }

        return formattedScheme
      }
  }


  // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */


async function findSteps(scheme_id) { 
  const possibleSteps = await db('schemes as sc')
    .leftJoin('steps as st', 'st.scheme_id', 'sc.scheme_id')
    .select('sc.scheme_name',
      'st.step_id',
      'st.step_number',
      'st.instructions')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number')
  
  if (possibleSteps[0].instructions === null) {
    return []
  } else {
    return possibleSteps
  }
  
  // EXERCISE C
  /*

    select * from schemes as sc
    left join steps as st
    on sc.scheme_id = st.scheme_id
    where sc.scheme_id = 7
    order by st.step_number;

    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

async function add(scheme) {
    const [id] = await db('schemes').insert(scheme)
    return findById(id)
}
  // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */


async function addStep(scheme_id, step) {

  const stepFormat = {
    step_number: step.step_number,
    instructions: step.instructions,
    scheme_id: scheme_id
  }
  await db('steps').insert(stepFormat)
  const result = await findSteps(scheme_id)
  return(result)
  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
