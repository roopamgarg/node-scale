'use strict';

module.exports = {

    /**
     * Detect which server to communicate.
     */
    GET_SERVER_META: 'get-server-meta',

    /**
     * Update the recent counter value.
     */
    UPDATE: 'update',

    /**
     * Initialize socket server.
     */
    INITIALIZE: 'initialize',

    /**
     * Trigger a remote computation.
     */
    COMPUTE: 'compute',

    /**
     * Increment the master `counter` value with the incoming data.
     */
    INCREMENT: 'increment'
};
