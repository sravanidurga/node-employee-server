const wrapper = (customError, fn, ...arguments) => {
	let response = null;
	let success = false;
	try {
		response = fn.apply(null, arguments);

	} catch (error) {
		console.log(error);
	}
	let statusCode = (response !== null && response !== undefined) ? 200 : 500;
	return {
		response,
		statusCode,
		customError
	};
}

const asyncWrapper = async (customError, fn, ...arguments) => {
	let response = null;
	let statusCode = 200;
	const start = new Date().getMilliseconds();
	const startTime = getIndianTime();
	let didFinish = false;
	try {
		response = await fn.apply(null, arguments);
		didFinish = true;
		customError = undefined;
	} catch (error) {
		statusCode = 500;
		if (typeof error === 'string') {
			if (errorConfig[error]) {
				statusCode = errorConfig[error].StatusCode
				customError = errorConfig[error].Message
			}
		}
	} finally {
		let end = new Date().getMilliseconds();
		console.log(startTime, end - start, fn.name, didFinish ? "completed" : "not completed");
	}
	return {
		response,
		statusCode,
		customError
	};
}

const determineSuccessStatus = (response) => {
	let successStatus = false;
	let checkIfArray = Array.isArray(response);
	if (checkIfArray === true) {
		if (response.length) {
			successStatus = true;
		} else {
			successStatus = false;
		}
	} else {
		if (Object.keys(response).length) {
			successStatus = true;
		} else {
			successStatus = false;
		}
	}
	return successStatus;
}

const getIndianTime = () => {
	const currentTime = new Date();
	const currentOffset = currentTime.getTimezoneOffset();
	const ISTOffset = 330;
	const ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
	const hoursIST = ISTTime.getHours()
	const minutesIST = ISTTime.getMinutes()
	const secondsIST = ISTTime.getSeconds();
	return hoursIST + ":" + minutesIST + ":" + secondsIST;
}

const authorization = async (req, res, next) => {
	try {
		const token = req.headers['authtoken'] || req.query.APIKEY;
		if (!token) return res.status(400).json({
			response: null,
			statusCode: 400,
			customError: 'Please Provide AuthToken'
		});
		const authStatus = await jwt.verify(token);
		if (!authStatus) return res.status(401).json({
			response: null,
			statusCode: 401,
			customError: 'Access Revoked! Please Sign in Again'
		});
		// [CReview] : Code Breakage Due to Accessing UAS from Payload Which is Already Empty
		// req.user = (await userRepo.getUserByID(authStatus.UAS));
		//req.user = (await accountUserRepo.getAccountUserByUserId(authStatus.UAS))._doc; //TODO: HAVE TO LOOK AT IT AS WE DON'T USE IT ANYWHERE
		next();
	} catch (error) {
		if (error.name == 'TokenExpiredError') {
			res.status(401).json({
				response: null,
				statusCode: 401,
				customError: 'Session Expired! Please Sign in Again'
			});
		} else if (error.name == 'JsonWebTokenError') {
			res.status(403).json({
				response: null,
				statusCode: 401,
				customError: 'Invalid Token! Please Sign in Again'
			});
		} else {
			res.status(500).json({
				response: null,
				statusCode: 500,
				customError: 'Internal Server Error'
			});
		}
	}
}


const middleware = {
	wrapper: wrapper,
	asyncWrapper: asyncWrapper,
	getIndianTime: getIndianTime,
	authorization: authorization,
};

module.exports = middleware;