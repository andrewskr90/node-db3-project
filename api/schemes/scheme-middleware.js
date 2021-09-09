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
  if (!scheme.scheme_name || typeof scheme.scheme_name !== 'string') {
    error.message = 'invalid scheme_name'
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
  const step = req.body
  const error = {
    status: 400
  }
  if (!step.step_number || 
    typeof step.step_number !== 'number' ||
    step.step_number <1) {
    error.message = 'invalid step'
  } else if (!step.instructions ||
    typeof step.instructions !== 'string') {
    error.message = 'invalid step'
  }
  if (error.message) {
    next(error)
  } else {
    next()
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
