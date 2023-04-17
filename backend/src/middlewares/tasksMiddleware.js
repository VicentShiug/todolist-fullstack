const validateBody = (req, res, next) => {
  const { body } = req

  if (body.title === undefined) {
    return res.status(400).json({
      message: 'The field "title" is required!'
    })
  }

  if (body.title === '') {
    return res.status(400).json({
      message: 'The field "title" cannot be empyt!'
    })
  }

  next()
}

module.exports = {
  validateBody
}