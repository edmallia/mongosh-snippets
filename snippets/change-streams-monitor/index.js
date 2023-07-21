(() => {
  const localRequire = require("module").createRequire(__filename);

  globalThis.listChangeStreams = function (
    allUsers = true,
    idleConnections = true,
    idleCursors = true,
    idleSessions = true,
    localOps = true,
    extended = false
  ) {
    tableData = [];
    changeStreamsDataRaw = getChangeStreams(
      allUsers,
      idleConnections,
      idleCursors,
      idleSessions,
      true,
      localOps
    );
    console.log("Found " + changeStreamsDataRaw.length + " change streams");
    for (var i in changeStreamsDataRaw) {
      changeStreamOpData = changeStreamsDataRaw[i];
      //print(EJSON.stringify(changeStreamOpData, null, 2));
      // print(EJSON.stringify(changeStreamOpData.cursor.originatingCommand.pipeline, null, 2));
      clientDriver = "N/A";
      try {
        clientDriver =
          changeStreamOpData.clientMetadata.driver.name +
          ": " +
          changeStreamOpData.clientMetadata.driver.version;
      } catch (error) {}
      // pipeline = customString(EJSON.stringify(changeStreamOpData.cursor.originatingCommand.pipeline, null, 2));
      pipeline = EJSON.stringify(
        changeStreamOpData.cursor.originatingCommand.pipeline,
        null,
        2
      );
      // pipeline = "[ ]"
      usersStr = "";
      for (var u in changeStreamOpData.effectiveUsers) {
        user = changeStreamOpData.effectiveUsers[u];
        usersStr = usersStr + user.user + "@" + user.db + "; ";
      }
      if (extended) {
        tableData.push(
          new ExtendedChangeStreamsData(
            changeStreamOpData.cursor.cursorId,
            changeStreamOpData.ns,
            pipeline,
            changeStreamOpData.cursor.lastAccessDate,
            changeStreamOpData.type,
            changeStreamOpData.cursor.nDocsReturned,
            changeStreamOpData.cursor.createdDate
          )
        );
      } else {
        tableData.push(
          new ChangeStreamsData(
            changeStreamOpData.appName,
            changeStreamOpData.client,
            clientDriver,
            changeStreamOpData.active,
            changeStreamOpData.connectionId,
            usersStr,
            changeStreamOpData.ns,
            pipeline,
            changeStreamOpData.cursor.lastAccessDate,
            changeStreamOpData.type,
            changeStreamOpData.cursor.nDocsReturned
          )
        );
      }
    }
    customConsoleTable(tableData);
  };

  globalThis.ChangeStreamsData = function (
    appName,
    clientIp,
    clientDriver,
    active,
    connId,
    users,
    ns,
    pipeline,
    lastAccessDate,
    type,
    nDocsReturned
  ) {
    this.appName = appName;
    this.clientIp = clientIp;
    this.clientDriver = clientDriver;
    this.active = active;
    this.connId = connId;
    this.users = users;
    this.ns = ns;
    this.pipeline = pipeline;
    this.lastAccessDate = lastAccessDate;
    this.type = type;
    this.nDocsReturned = nDocsReturned;
  };

  globalThis.ExtendedChangeStreamsData = function (
    cursorId,
    ns,
    pipeline,
    lastAccessDate,
    type,
    nDocsReturned,
    createdDate
  ) {
    this.ns = ns;
    this.pipeline = pipeline;
    this.lastAccessDate = lastAccessDate;
    this.type = type;
    this.nDocsReturned = nDocsReturned;
    this.cursorId = cursorId;
    this.createdDate = createdDate;
  };

  globalThis.getChangeStreams = function (
    allUsers,
    idleConnections,
    idleCursors,
    idleSessions,
    backtrace,
    localOps
  ) {
    pipeline = [
      {
        $currentOp: {
          allUsers: allUsers,
          idleConnections: idleConnections,
          idleCursors: idleCursors,
          idleSessions: idleSessions,
          backtrace: backtrace,
          localOps: localOps,
        },
      },
      {
        $match: {
          "cursor.tailable": true,
          "cursor.originatingCommand.pipeline.0.$changeStream": {
            $exists: true,
          },
        },
      },
    ];
    changeStreamsDataRaw = db
      .getSiblingDB("admin")
      .aggregate(pipeline)
      .toArray();
    return changeStreamsDataRaw;
  };

  globalThis.customConsoleTable = function (data) {
    let output = [];

    data.forEach((row) => {
      if (row["pipeline"] && typeof row["pipeline"] === "string") {
        let pipelineParts = row["pipeline"].split("\n");
        if (pipelineParts && pipelineParts.length > 1) {
          //add entry to output per line in pipeline string
          let firstLineCompleted = false;

          let longestString = 0;
          pipelineParts.forEach((part) => {
            if (part.length > longestString) {
              longestString = part.length;
            }
          });

          pipelineParts.forEach((part) => {
            if (!firstLineCompleted) {
              let newRow = { ...row };
              newRow["pipeline"] = part.padEnd(longestString, " ");
              output.push(newRow);
              firstLineCompleted = true;
            } else {
              let newRow = {};
              newRow["pipeline"] = part.padEnd(longestString, " ");
              output.push(newRow);
            }
          });
        } else {
          //pipeline only has one line
          output.push(row);
        }
      } else {
        //no pipeline
        output.push(row);
      }
    });

    console.table(output);
  };
})();
