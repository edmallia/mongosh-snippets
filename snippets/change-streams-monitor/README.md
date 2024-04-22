# change-stream-monitor

This snippet allows mongosh users to monitor Change Streams on the current server.

On installation of this snippet, the following functions are available to the user.

## listChangeStreams(extended?: boolean, allUsers?: boolean, nsFilter?: Array<string>)

Prints a table with the currently open Change Streams. Note that the table resizes itself based on the size of the terminal.

The behaviour of the function can be controlled with the available parameters (see parameter defaults for default behaviour). See prettyPrintChangeStreamPipeline() to pretty print a change stream pipeline. See ChangeStreamsData and ExtendedChangeStreamsData for data outputted in extended and non-extended mode.

* *extended* - Controls whether a simple or extended output is presented. Refer to ExtendedChangeStreamsData. Defaults to false.
* *allUsers* - Boolean that correspond's to the allUsers flag of the $currentOp MongoDB Pipeline Stage i.e. If set to false, $currentOp only reports on operations/idle connections/idle cursors/idle sessions belonging to the user who ran the command. If set to true, $currentOp reports operations belonging to all users. Defailts to true.
* *nsFilter* - An optional array of namespace filter. Defaults to [] i.e. to filter.

### Sample Output - Normal Mode

```
  ┏━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
  ┃  ConnID   ┃  AppName   ┃  Remote      ┃  Driver      ┃  NS          ┃  Type  ┃  Pipeline    ┃  LastAccess  ┃  DocsReturn  ┃
  ┃           ┃            ┃              ┃              ┃              ┃        ┃              ┃  Date        ┃  ed          ┃
  ┡━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━┩
  │  74       │  cs2       │  127.0.0.1:  │  mongo-java  │  test.event  │  op    │  [           │  "2024-04-2  │  0           │
  │           │            │  54989       │  -driver|sy  │  s           │        │  {           │  2T13:23:10  │              │
  │           │            │              │  nc: 4.9.1   │              │        │  "$changeSt  │  .160Z"      │              │
  │           │            │              │              │              │        │  ream": {}   │              │              │
  │           │            │              │              │              │        │  },          │              │              │
  │           │            │              │              │              │        │  {           │              │              │
  │           │            │              │              │              │        │  "$match":   │              │              │
  │           │            │              │              │              │        │  {           │              │              │
  │           │            │              │              │              │        │  "operation  │              │              │
  │           │            │              │              │              │        │  Type": {    │              │              │
  │           │            │              │              │              │        │  "$in": [    │              │              │
  │           │            │              │              │              │        │  "insert",   │              │              │
  │           │            │              │              │              │        │  "update"    │              │              │
  │           │            │              │              │              │        │  ]           │              │              │
  │           │            │              │              │              │        │  }           │              │              │
  │           │            │              │              │              │        │  }           │              │              │
  │           │            │              │              │              │        │  }           │              │              │
  │           │            │              │              │              │        │  ]           │              │              │
  ├───────────┼────────────┼──────────────┼──────────────┼──────────────┼────────┼──────────────┼──────────────┼──────────────┤
  │  79       │  cs1       │  127.0.0.1:  │  mongo-java  │  test.event  │  op    │  [           │  "2024-04-2  │  0           │
  │           │            │  55011       │  -driver|sy  │  s           │        │  {           │  2T13:23:10  │              │
  │           │            │              │  nc: 4.9.1   │              │        │  "$changeSt  │  .181Z"      │              │
  │           │            │              │              │              │        │  ream": {}   │              │              │
  │           │            │              │              │              │        │  },          │              │              │
  │           │            │              │              │              │        │  {           │              │              │
  │           │            │              │              │              │        │  "$match":   │              │              │
  │           │            │              │              │              │        │  {           │              │              │
  │           │            │              │              │              │        │  "operation  │              │              │
  │           │            │              │              │              │        │  Type": {    │              │              │
  │           │            │              │              │              │        │  "$in": [    │              │              │
  │           │            │              │              │              │        │  "insert",   │              │              │
  │           │            │              │              │              │        │  "update"    │              │              │
  │           │            │              │              │              │        │  ]           │              │              │
  │           │            │              │              │              │        │  }           │              │              │
  │           │            │              │              │              │        │  }           │              │              │
  │           │            │              │              │              │        │  }           │              │              │
  │           │            │              │              │              │        │  ]           │              │              │
  └───────────┴────────────┴──────────────┴──────────────┴──────────────┴────────┴──────────────┴──────────────┴──────────────┘
```

### Sample Output - Extended

```
  ┏━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┓
  ┃  ConnID  ┃  AppNam  ┃  Remote  ┃  Driver  ┃  NS      ┃  Type  ┃  Pipeli  ┃  LastAc  ┃  DocsRe  ┃  Active  ┃  User    ┃  Cursor  ┃  Create  ┃
  ┃          ┃  e       ┃          ┃          ┃          ┃        ┃  ne      ┃  cessDa  ┃  turned  ┃          ┃          ┃  Id      ┃  dDate   ┃
  ┃          ┃          ┃          ┃          ┃          ┃        ┃          ┃  te      ┃          ┃          ┃          ┃          ┃          ┃
  ┡━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━┩
  │  74      │  cs2     │  127.0.  │  mongo-  │  test.e  │  op    │  [       │  "2024-  │  0       │  true    │  john@a  │  754369  │  "2024-  │
  │          │          │  0.1:54  │  java-d  │  vents   │        │  {       │  04-22T  │          │          │  dmin    │  716098  │  04-22T  │
  │          │          │  989     │  river|  │          │        │  "$chan  │  13:24:  │          │          │          │  703700  │  12:15:  │
  │          │          │          │  sync:   │          │        │  geStre  │  25.528  │          │          │          │  0       │  31.896  │
  │          │          │          │  4.9.1   │          │        │  am":    │  Z"      │          │          │          │          │  Z"      │
  │          │          │          │          │          │        │  {}      │          │          │          │          │          │          │
  │          │          │          │          │          │        │  },      │          │          │          │          │          │          │
  │          │          │          │          │          │        │  {       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "$matc  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  h": {   │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "opera  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  tionTy  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  pe": {  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "$in":  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  [       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "inser  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  t",     │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "updat  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  e"      │          │          │          │          │          │          │
  │          │          │          │          │          │        │  ]       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  }       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  }       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  }       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  ]       │          │          │          │          │          │          │
  ├──────────┼──────────┼──────────┼──────────┼──────────┼────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
  │  79      │  cs1     │  127.0.  │  mongo-  │  test.e  │  op    │  [       │  "2024-  │  0       │  true    │  mary@a  │  697267  │  "2024-  │
  │          │          │  0.1:55  │  java-d  │  vents   │        │  {       │  04-22T  │          │          │  dmin    │  149292  │  04-22T  │
  │          │          │  011     │  river|  │          │        │  "$chan  │  13:24:  │          │          │          │  716100  │  12:16:  │
  │          │          │          │  sync:   │          │        │  geStre  │  25.542  │          │          │          │  0       │  01.889  │
  │          │          │          │  4.9.1   │          │        │  am":    │  Z"      │          │          │          │          │  Z"      │
  │          │          │          │          │          │        │  {}      │          │          │          │          │          │          │
  │          │          │          │          │          │        │  },      │          │          │          │          │          │          │
  │          │          │          │          │          │        │  {       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "$matc  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  h": {   │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "opera  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  tionTy  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  pe": {  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "$in":  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  [       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "inser  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  t",     │          │          │          │          │          │          │
  │          │          │          │          │          │        │  "updat  │          │          │          │          │          │          │
  │          │          │          │          │          │        │  e"      │          │          │          │          │          │          │
  │          │          │          │          │          │        │  ]       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  }       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  }       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  }       │          │          │          │          │          │          │
  │          │          │          │          │          │        │  ]       │          │          │          │          │          │          │
  └──────────┴──────────┴──────────┴──────────┴──────────┴────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

## prettyPrintChangeStreamPipeline(connectionId: any)

Pretty prints the Change Stream pipeline for a given Connection ID.
* *connectionId* - The connection ID where the change stream is executing.

### Example

```
replset [primary] test> prettyPrintChangeStreamPipeline(74)
[
  { '$changeStream': {} },
  {
    '$match': { operationType: { '$in': [ 'insert', 'update' ] } }
  }
]
```