const girlController = require('../controllers/girlController');

module.exports = function(app) {
    app.route('/girls').get(girlController.list_all);
    app.route('/girl').get(girlController.get_a_girl_imgs);
}