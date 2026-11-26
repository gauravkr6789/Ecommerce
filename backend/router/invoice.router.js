import express from 'express'
import { downloadInvoice } from '../utils/invoice/invoiceGererator.js'

const invoiceRouter = express.Router();

invoiceRouter.get('/:id', downloadInvoice);

export default invoiceRouter