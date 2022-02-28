const aws = require("aws-sdk");

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */

const adminUsers = ["marios.simouu@gmail.com"];
const GROUPS = {
  ADMIN: "Admin",
  GUEST: "Guest",
};
exports.handler = async (event) => {
  const {
    userPoolId,
    userName,
    request: { userAttributes },
  } = event;

  const isAdmin = adminUsers.includes(userAttributes.email);
  const groupName = isAdmin ? GROUPS.ADMIN : GROUPS.GUEST;
  console.log("email: ", userAttributes.email, "\tgroupName: ", groupName);
  const groupParams = {
    GroupName: groupName,
    UserPoolId: userPoolId,
  };

  const addUserParams = {
    GroupName: groupName,
    UserPoolId: userPoolId,
    Username: userName,
  };

  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }

  await cognitoidentityserviceprovider
    .adminAddUserToGroup(addUserParams)
    .promise();

  return event;
};
