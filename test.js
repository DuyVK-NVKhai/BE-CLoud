const { connect, StringCodec, Subscription } = require("nats");


const createConn = async function () {
    return await connect({ servers: "localhost:4222" });
}

const sub = async function () {
    sc = StringCodec()
    const nc = await createConn()
    const s1 = nc.subscribe("channels.service.now")
    const func = async (s1) => {
        console.log(`listening for ${s1.getSubject()} requests...`);
        for await (const m of s1) {
            const chunks = m.subject.split(".");
            console.log({ m })
            console.log({ chunks })
            console.log(m.data.toString())
            if (m.respond(sc.encode(new Date().toISOString()))) {
                console.info(`[time] handled #${s1.getProcessed()}`);
            } else {
                console.log(`[time] #${s1.getProcessed()} ignored - no reply subject`);
            }
        }
        console.log(`subscription ${s1.getSubject()} drained.`);
    };
    func(s1)
    // printMsgs(s1)
}

// subject: string;
//     sid: number;
//     reply?: string;
//     data: Uint8Array;
//     headers?: MsgHdrs;
//     respond(data?: Uint8Array, opts?: PublishOptions): boolean;

sub()