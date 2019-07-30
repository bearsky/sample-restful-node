// Load Relative Models
const Employee = require('../../models/employee/employee');
const {Department} = require('../../models/employee/department');
const {Position} = require('../../models/employee/position');
const {Skill} = require('../../models/employee/skill');

// Employees List
exports.index = async (req, res) => {
    const pageNumber = 1;
    const pageSize = 10;
    try {
        const employees = await Employee
        .find({$and: [
            req.query.name ? {name: req.query.name} : {},
            req.query.department ? {'department.name': req.query.department} : {},
            req.query.position ? {'position.name': req.query.position} : {},
            req.query.skill ? {'skills.technology': req.query.skill} : {},
            req.query.active ? {active: req.query.active} : {}
        ]})
        .skip((parseInt(req.query.page - 1) || pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort('name');
        res.status(200).json({
            count: employees.length,
            employees: employees.map(employee => {
                return {
                    _id: employee._id,
                    name: employee.name,
                    avatar: employee.avatar ? req.protocol + '://' + req.get('host') + '/' + employee.avatar : null,
                    active: employee.active,
                    department: employee.department,
                    position: employee.position,
                    skills: employee.skills,
                    request: {
                        method: 'GET',
                        url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + employee._id
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
    }
};

// Employee Details
exports.show = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('department position skills');
        res.status(200).json({
            _id: employee._id,
            name: employee.name,
            avatar: employee.avatar ? req.protocol + '://' + req.get('host') + '/' + employee.avatar : null,
            active: employee.active,
            department: employee.department,
            position: employee.position,
            skills: employee.skills
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
};

// Employee Save
exports.store = async (req, res) => {
    try {
        const department = await Department.findById(req.body.departmentId);
        const position = await Position.findById(req.body.positionId);
        const skills = await Skill.find({
            _id: {
                $in: req.body.skills
            }
        });
        const employee =  new Employee({
            name: req.body.name,
            avatar: req.file ? req.file.path : null,
            active: !!Number(req.body.active),
            department: {
                _id: department._id,
                name: department.name
            },
            position: {
                _id: position._id,
                name: position.name
            },
            skills: skills
        });
        await employee.save();
        res.status(201).json({
            message: 'Employee created successfully',
            employee: {
                _id: employee._id,
                name: employee.name,
                avatar: employee.avatar ? req.protocol + '://' + req.get('host') + '/' + employee.avatar : null,
                active: employee.active,
                department: employee.department,
                position: employee.position,
                skills: employee.skills,
                request: {
                    method: 'GET',
                    url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + employee._id
                }
            }
        });
    } catch(err) {
        res.status(400).json({
            error: {
                message: err.message
            }
        });
    }
};

// Employee Update
exports.update = async (req, res) => {
    try {
        const department = await Department.findById(req.body.departmentId);
        const position = await Position.findById(req.body.positionId);
        const skills = await Skill.find({
            _id: {
                $in: req.body.skills
            }
        });
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                avatar: req.file ? req.file.path : null,
                active: req.body.active,
                department: {
                    _id: department._id,
                    name: department.name
                },
                position: {
                    _id: position._id,
                    name: position.name
                },
                skills: skills
            },
            {runValidators: true}
        );
        res.status(200).json({
            message: 'Employee updated successfully',
            employee: {
                _id: req.params.id,
                name: req.body.name || employee.name,
                avatar: req.file ? req.file.path : employee.avatar,
                active: req.body.active || employee.active,
                department: req.body.department || employee.department,
                position: req.body.position || employee.position,
                skills: skills || employee.skills,
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

// Employee Delete
exports.destroy = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'Employee deleted successfully'
        });
    } catch(err) {
        res.status(404).json({
            errors: {
                message: err.message
            }
        });
    }
};