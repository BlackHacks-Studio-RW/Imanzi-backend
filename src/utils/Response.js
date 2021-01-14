class Response {
    static send200(res, msg, val) {
      /* istanbul ignore next */
      var payload = typeof val === "undefined" ? "" : val;
      return res.status(200).json({
        status: 200,
        message: msg,
        payload: payload
      });
    }
    /* istanbul ignore next */
    static send201(res, msg, data) {
      /* istanbul ignore next */
      return res.status(201).json({
        status: 201,
        message: msg,
        result: data
      });
    }
    /* istanbul ignore next */
    static send204(res, msg) {
      /* istanbul ignore next */
      return res.status(204).json({
        status: 204,
        message: msg
      });
    }
  
    /* istanbul ignore next */
    static send400(res, error) {
      /* istanbul ignore next */
      return res.status(400).json({
        status: 400,
        message: error
      });
    }
    /* istanbul ignore next */
    static send401(res, error) {
      /* istanbul ignore next */
      return res.status(401).json({
        status: 401,
        message: error
      });
    }
  
    static send403(res, error) {
      return res.status(403).json({
        status: 403,
        message: error
      });
    }
  
    static send404(res, error) {
      return res.status(404).json({
        status: 404,
        message: error
      });
    }
    /* istanbul ignore next */
    static send409(res, error) {
      /* istanbul ignore next */
      return res.status(409).json({
        status: 409,
        message: error
      });
    }
    static sendFailure(res, error, className) {
      /* istanbul ignore next */
      console.error(`ERROR at ${className}:`, error.message);
      return res.status(501).json({
        status: 501,
        message: "Something went wrong"
      });
    }
    /* istanbul ignore next */
    static send500(res, error) {
      /* istanbul ignore next */
      return res.status(500).json({
        status: 500,
        message: error
      });
    }
  }
  
  export default Response;
  