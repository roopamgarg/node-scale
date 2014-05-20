'use strict';

module.exports = {
    ip: {
        STREAM_LB: '192.168.56.109',
        STREAM_1: '192.168.56.101',
        STREAM_2: '192.168.56.102',
        STREAM_3: '192.168.56.103',
        MASTER: '192.168.56.104',
        WORKER_1: '192.168.56.105',
        WORKER_2: '192.168.56.106',
        WORKER_3: '192.168.56.107',
        WORKER_4: '192.168.56.108',
        workers: ['192.168.56.105', '192.168.56.106', '192.168.56.107', '192.168.56.108']
    },
    relationship: {
        STREAM_LB: ['STREAM_1', 'STREAM_2', 'STREAM_3'],
        MASTER: ['WORKER_1', 'WORKER_2', 'WORKER_3', 'WORKER_4']
    }
};
