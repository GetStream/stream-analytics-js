var engagement = {
    label: {presence: true},
    score: {
        presence: true,
        numericality: true
    },
    activityId: {presence: true}
};

var impression = {
  activityIds: {
    presence: true
  }
};

var userData = {};

module.exports = {
    engagementSpec: engagement,
    impressionSpec: impression,
    userDataSpec: userData,
};
