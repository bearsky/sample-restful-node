const {Position} = require('../../models/employee/position');

exports.index = async (req, res) => {
    try {
        const positions = await Position.find().sort('name');
        res.status(200).json({
            count: positions.length,
            positions: positions.map(position => {
                return {
                    _id: position._id,
                    name: position.name,
                    request: {
                        method: 'GET',
                        url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + position.id
                    }
                }
            })
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    };
}

exports.show = async (req, res) => {
    try {
        const position = await Position.findById(req.params.id);
        res.status(200).json({
            position
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    };
};