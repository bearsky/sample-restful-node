// Load User Model
const User = require('../models/user');

exports.index = async (req, res) => {
    try {
        const users = await User.find().select('id name email password createdAt updatedAt');
        res.status(200).json({
            count: users.length,
            users: users.map(user => {
                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    registered: user.createdAt,
                    updated: user.updatedAt
                }
            })
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}

exports.show = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            registered: user.createdAt,
            updated: user.updatedAt
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                updated: Date.now
            },
            {runValidators: true}
        );
        res.status(200).json({
            message: 'User updated successfully',
            user: {
                _id: req.params.id,
                name: req.body.name || user.name,
                email: req.body.email || user.email,
                registered: user.created,
                updated: user.updated,
                request: {
                    method: 'GET',
                    url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + user._id
                }
            }
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}

// Employee Update
exports.update = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                avatar: req.file ? req.file.path : null,
                active: req.body.active
            }
        );
        const department = await Department.findOneAndUpdate(
            {
                employee: employee.id
            },
            {
                $set: {
                    id: employee.department.id,
                    employee: employee.id,
                    sphere: req.body.sphere
                }
            }
        );
        const position = await Position.findOneAndUpdate(
            {
                employee: employee.id
            },
            {
                $set: {
                    id: employee.position.id,
                    employee: employee.id,
                    rank: req.body.rank
                }
            }
        );
        const skills = await Skill.findOneAndUpdate(
            {
                employee: employee.id
            },
            {
                $set: {
                    id: employee.skills.id,
                    employee: employee.id,
                    technologies: req.body.technologies
                }
            }
        );
        res.status(200).json({
            message: 'Employee updated successfully',
            employee: {
                id: req.params.id,
                name: req.body.name || employee.name,
                avatar: req.file ? req.file.path : employee.avatar,
                active: req.body.active || employee.active,
                department: {
                    id: department.id,
                    employeeId: department.employee,
                    sphere: department.sphere
                } || employee.department,
                position: {
                    id: position.id,
                    employeeId: position.employee,
                    rank: position.rank
                } || employee.position,
                skills: {
                    id: skills.id,
                    employeeId: employee.id,
                    technologies: req.body.technologies
                } || employee.skills,
                request: {
                    method: 'GET',
                    url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + employee.id
                }
            }
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}

exports.delete = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
};