const {Department} = require('../../models/employee/department');

exports.index = async (req, res) => {
    try {
        const departments = await Department.find().sort('name');
        console.log(departments);
        res.status(200).json({
            count: departments.length,
            departments: departments.map(department => {
                return {
                    _id: department._id,
                    name: department.name,
                    request: {
                        method: 'GET',
                        url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + department.id
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
        const department = await Department.findById(req.params.id);
        res.status(200).json({
            department
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    };
};