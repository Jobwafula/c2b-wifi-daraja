const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API for handling MPESA STK Push payments
 */

/**
 * @swagger
 * /api/pay:
 *   post:
 *     summary: Initiate an MPESA STK Push payment
 *     description: |
 *       This endpoint initiates an MPESA STK Push payment request.
 *       It requires the user's phone number and the amount to be paid.
 *       The payment request is sent to the user's phone for authorization.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - amount
 *             properties:
 *               phone:
 *                 type: string
 *                 description: |
 *                   The user's phone number in the format 254712345678.
 *                   Must start with 254 and be 12 digits long.
 *                 example: "254712345678"
 *               amount:
 *                 type: string
 *                 description: |
 *                   The amount to be paid. Must be a positive number.
 *                 example: "50"
 *     responses:
 *       200:
 *         description: Payment request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment request sent"
 *                 data:
 *                   type: object
 *                   properties:
 *                     MerchantRequestID:
 *                       type: string
 *                       description: Unique identifier for the merchant request
 *                       example: "12345"
 *                     CheckoutRequestID:
 *                       type: string
 *                       description: Unique identifier for the checkout request
 *                       example: "67890"
 *       400:
 *         description: Bad request. Invalid input parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid phone number or amount"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while processing your request"
 */
router.post('/pay', paymentController.initiateSTKPush);

module.exports = router;