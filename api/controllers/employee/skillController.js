const {Skill} = require('../../models/employee/skill');

exports.index = async (req, res) => {
    try {
        const skills = await Skill.find().sort('technology');
        res.status(200).json({
            count: skills.length,
            skills: skills.map(skill => {
                return {
                    _id: skill._id,
                    technology: skill.technology,
                    request: {
                        method: 'GET',
                        url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + skill._id
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
};

exports.show = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        res.status(200).json({
            skill
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    };
};