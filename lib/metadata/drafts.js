module.exports = {
    Vote: {
        _id: 'String',
        __id: 'String', // previous version `_id`
        uuid: 'String',
        expired: 'Date',
        deleted: 'Date',

        precinct: { type: 'Reference', of: 'Precinct' },

        detailsJson : 'String',
        detailsJsonSignature : 'String',

        detailsJsonDecodedObject : { type: 'Embedded', of: 'VoteDetails' },
    },

    VoteDetails: {
        _id: 'String',
        __id: 'String', // previous version `_id`
        uuid: 'String',
        expired: 'Date',
        deleted: 'Date',

        seed: 'Number',
        candidate: 'String'
    },

    Person: {
        _id: 'String',
        __id: 'String', // previous version `_id`
        uuid: 'String',
        expired: 'Date',
        deleted: 'Date',

        authoredOn: 'Date',
        authoredBy: { type: 'Reference', of: 'Person' },

        lastName: 'String',
        firstName: 'String',
        middleName: 'String',

        birthDate: 'String',

        passportNumber: 'String',
        passportIssuedBy: 'String',
        passportIssuedDate: 'Date',

        publicKey: 'String',
    },

    Precinct: {
        _id: 'String',
        __id: 'String', // previous version `_id`
        uuid: 'String',
        deleted: 'Date',
        expired: 'Date',

        authoredOn: 'Date',
        authoredBy: { type: 'Reference', of: 'Person' },

        name: 'String',
        publicKey: 'String',
    }
};