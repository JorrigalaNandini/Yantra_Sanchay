
const getMachinery = (req, res) => {
    res.json({
        success: true,
        message: "Machinery API is working 🚜",
        machinery: []
    });
};

module.exports = {
    getMachinery
};