const errorProcessor = async (err, req, res, next) => {
  switch (err.httpStatusCode) {
    case 400:
      res.status(400).send(err);
      break;
    case 401:
      res.status(401).send(err || "Unauthorised request.");
      break;
    case 403:
      res.status(403).send(err || "Forbidden request.");
      break;
    case 404:
      res.status(404).send(err);
      break;
    case 405:
      res.status(405).send(err || "Request not allowed.");
      break;
    case 406:
      res.status(406).send(err || "Request not acceptable.");
      break;
    default:
      res.status(500).send("An unknown error has occurred.");
      break;
  }
};

module.exports = { errorProcessor };
