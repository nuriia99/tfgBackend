
export const handleError = (status) => {
  const error = new Error()
  error.status = status
  return error
}
