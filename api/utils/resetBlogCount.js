const cron = require('node-cron')
const logger = require('../utils/logger')
const User = require('../models/user')

let cronJob = null

// this function resets the value of blogsCreatedToday to 0 in every 24 hours
function resetBlogCount() {
    cronJob = cron.schedule('0 0 * * * ', async () => {
        logger.info('cron job is running')
        try {
            const result = await User.updateMany({}, { $set: { blogsCreatedToday: 0 } })
            logger.info(`Reset blogsCreatedToday for ${result.modifiedCount} users.`)
        } catch (error) {
            logger.error('Error resetting blogsCreatedToday:', error.message)
        }
    })
}

function isInitialized() {
    return cronJob
}

module.exports = {
    resetBlogCount,
    isInitialized
}