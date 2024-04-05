"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongo = _interopRequireDefault(require("./utils/mongo.js"));

var _redis = _interopRequireDefault(require("./utils/redis.js"));

var _logger = _interopRequireDefault(require("./utils/logger.js"));

var _authRoutes = _interopRequireDefault(require("./routes/authRoutes.js"));

var _welcome = _interopRequireDefault(require("./routes/welcome.js"));

var _Route = _interopRequireDefault(require("./routes/404Route.js"));

var _helmet = _interopRequireDefault(require("helmet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config(); // Load environment variables from .env file


var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use((0, _helmet["default"])());
var port = process.env.SERVER_PORT;
var type = process.env.CONTEXT;

if (!app || !port || !type) {
  _logger["default"].warn('Please provide the server port and the server type in order to run the server');

  process.exit(1);
}

(0, _mongo["default"])();

_redis["default"].connect(); // Routes for server


app.use(_welcome["default"]);
app.use(_authRoutes["default"]);
app.use(_Route["default"]); // Define a route to handle form submissions

app.post('/submit-form', function _callee(req, res) {
  var formData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            formData = req.body; // Process and save the form data to MongoDB
            // Example: const savedData = await saveFormDataToDatabase(formData);

            res.status(200).json({
              message: 'Form submitted successfully!',
              data: formData
            });
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
              error: 'Internal server error'
            });
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.listen(port, function () {
  _logger["default"].info("".concat(type, " Server is running on port ").concat(port));
});