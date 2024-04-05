"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("./utils/dotenv.js"));

var _mongo = _interopRequireDefault(require("./utils/mongo.js"));

var _redis = _interopRequireDefault(require("./utils/redis.js"));

var _logger = _interopRequireDefault(require("./utils/logger.js"));

var _authRoutes = _interopRequireDefault(require("./routes/authRoutes.js"));

var _welcome = _interopRequireDefault(require("./routes/welcome.js"));

var _Route = _interopRequireDefault(require("./routes/404Route.js"));

var _helmet = _interopRequireDefault(require("helmet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import bodyParser from 'body-parser';
_dotenv["default"];
var app = (0, _express["default"])(); // app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

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
// Default route for the server to check if the server is running


app.use(_welcome["default"]); // Auth routes

app.use(_authRoutes["default"]); // Handle form submission

app.post('/api/submit-form', function _callee(req, res) {
  var newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Create a new user instance with data from the form
          newUser = new User({
            name: req.body.name,
            profession: req.body.profession,
            specialization: req.body.specialization,
            location: req.body.location,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            about: req.body.about,
            skills: req.body.skills.split(',').map(function (skill) {
              return skill.trim();
            }),
            // Assuming skills are comma-separated
            education: req.body.education.split(',').map(function (edu) {
              return edu.trim();
            }),
            experience: req.body.experience.split(',').map(function (exp) {
              return exp.trim();
            }),
            courses: req.body.courses.split(',').map(function (course) {
              return course.trim();
            })
          }); // Save the user data to the database

          _context.next = 4;
          return regeneratorRuntime.awrap(newUser.save());

        case 4:
          res.status(201).send('Form submitted successfully');
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).send('Internal server error');

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // 404 route for the server to handle invalid routes

app.use(_Route["default"]);
app.listen(port, function () {
  _logger["default"].info("".concat(type, " Server is running on port ").concat(port));
});