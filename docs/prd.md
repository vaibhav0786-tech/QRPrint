# Product Requirements Document

QRPrint accepts a QR-linked guest print request, collects a document and print specification, obtains a merchant pricing quote, takes provider-confirmed payment, then delivers the paid job to the merchant's local queue. Required job states: `draft`, `uploaded`, `quoted`, `payment_pending`, `paid`, `queued`, `printing`, `ready`, `failed`, `collected`, and `refunded`. Collection tokens must be opaque, single-job values. No price, payment confirmation, page count, or print-ready status may be trusted from the browser.
