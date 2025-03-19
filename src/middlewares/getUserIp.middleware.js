import axios from "axios";

// export const getUserIp = async (req, res, next) => {
//     try {
//         const userIp = req.ip;
//         console.log(req.headers)

//         if (req.headers['x-forwarded-for']) {
//             userIp = req.headers['x-forwarded-for'].split(',')[0]; // Get the first IP in case of multiple proxies
//         };

//         console.log(`User IP: ${userIp}`)

//         const response = await axios.get(`http://api.ipstack.com/${userIp}?access_key=${process.env.IPSTACK_API_KEY}&output=json`);
//         const location = response.data;

//         console.log(`Geolocation for ${userIp}: ${location.city}, ${location.country_name}, ${location.longitude}, ${location.latitude}`)

//         req.userInfo = {
//             ip: userIp,
//             city: location.city,
//             country: location.country_name,
//             latitude: location.latitude,
//             longitude: location.longitude
//         };

//         next();
//     } catch (error) {
//         console.log(`Error: ${error}`)
//         return res.status(500).json({
//             message: "Could not get user's ip.",
//             status: "Error",
//             Error: error.message
//         })
//     }
// }

export const getUserIp = async (req, res, next) => {
    const ip = 
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress || '';

    // console.log(`User's IP: ${ip}`)

    next();
}