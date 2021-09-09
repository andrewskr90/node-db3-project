const Schemes = require('./scheme-model')
/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  try{
    const possibleScheme = await Schemes.findById(req.params.scheme_id)
    req.scheme = possibleScheme
    next()
  } catch (err) {
    next({
      status: 404,
      message: `scheme with scheme_id ${req.params.scheme_id} not found`
    })
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const scheme = req.body
  const error = { status: 400 }
  if (!scheme.scheme_name) {
    error.message = 'invalid scheme_name'
  } else if (!scheme.step_number || 
    typeof scheme.step_number !== 'number') {
    error.message = 'invalid step'
  } else if (!scheme.instructions) {
    error.message = 'invalid step'
  }
  if (error.message) {
    next(error)
  } else {
    next()
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {

}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
