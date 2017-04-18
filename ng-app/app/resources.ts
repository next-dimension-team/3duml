import { ResourceDefinition } from 'ngrx-json-api';

export const resourceDefinitions: Array<ResourceDefinition> = [

  {
    type: 'CombinedFragment',
    collectionPath: 'combined-fragments',
    attributes: {
      name: 'name',
      operator: 'operator',
      created_at: 'created_at',
      updated_at: 'updated_at'
    },
    relationships: {
      fragment: {
        type: 'InteractionFragment',
        relationType: 'hasOne'
      }
    }
  },

  {
    type: 'ExecutionSpecification',
    collectionPath: 'execution-specifications',
    attributes: {
      created_at: 'created_at',
      updated_at: 'updated_at'
    },
    relationships: {
      fragment: {
        type: 'InteractionFragment',
        relationType: 'hasOne'
      },
      start: {
        type: 'OccurrenceSpecification',
        relationType: 'hasOne'
      },
      finish: {
        type: 'OccurrenceSpecification',
        relationType: 'hasOne'
      }
    }
  },

  {
    type: 'InteractionFragment',
    collectionPath: 'interaction-fragments',
    attributes: {
      name: 'name',
      created_at: 'created_at',
      updated_at: 'updated_at'
    },
    relationships: {
      fragmentable: {
        type: 'any', // TODO morph
        relationType: 'hasOne'
      },
      parent: {
        type: 'InteractionFragment',
        relationType: 'hasOne'
      },
      children: {
        type: 'InteractionFragment',
        relationType: 'hasMany'
      }
    }
  },

  {
    type: 'InteractionOperand',
    collectionPath: 'interaction-operands',
    attributes: {
      name: 'name',
      constraint: 'constraint',
      created_at: 'created_at',
      updated_at: 'updated_at'
    },
    relationships: {
      fragment: {
        type: 'InteractionFragment',
        relationType: 'hasOne'
      }
    }
  },

  {
    type: 'Lifeline',
    collectionPath: 'lifelines',
    attributes: {
      name: 'name',
      order: 'order',
      created_at: 'created_at',
      updated_at: 'updated_at'
    },
    relationships: {
      interaction: {
        type: 'Interaction',
        relationType: 'hasOne'
      },
      occurrenceSpecifications: {
        type: 'OccurrenceSpecification',
        relationType: 'hasMany'
      }
    }
  },

  {
    type: 'Message',
    collectionPath: 'messages',
    attributes: {
      name: 'name',
      kind: 'kind',
      sort: 'sort',
      created_at: 'created_at',
      updated_at: 'updated_at'
    },
    relationships: {
      interaction: {
        type: 'Interaction',
        relationType: 'hasOne'
      },
      sendEvent: {
        type: 'OccurrenceSpecification',
        relationType: 'hasOne'
      },
      receiveEvent: {
        type: 'OccurrenceSpecification',
        relationType: 'hasOne'
      }
    }
  },

  {
    type: 'OccurrenceSpecification',
    collectionPath: 'occurrence-specifications',
    attributes: {
      time: 'time',
      created_at: 'created_at',
      updated_at: 'updated_at'
    },
    relationships: {
      sendingEventMessages: {
        type: 'Message',
        relationType: 'hasMany'
      },
      receivingEventMessages: {
        type: 'Message',
        relationType: 'hasMany'
      },
      startingExecutionSpecifications: {
        type: 'ExecutionSpecification',
        relationType: 'hasMany'
      },
      finishingExecutionSpecifications: {
        type: 'ExecutionSpecification',
        relationType: 'hasMany'
      },
      covered: {
        type: 'Lifeline',
        relationType: 'hasOne'
      }
    }
  }

];
