import Redis from "ioredis";
import { pack, unpack } from "msgpackr";

export const db = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

export async function ping() {
  const pong = await db?.ping();
  return pong === "PONG";
}

export async function set(...args) {
  // check that each key gets a value
  if (args.length < 1 || args.length % 2 === 1) {
    return Promise.reject("bad amount of arguments");
  }

  // check for redis db connection
  if (!(await ping())) {
    return Promise.reject("No redis connection");
  }

  // pack values
  const query = new Array();
  for (let i = 0; i < args.length; i += 2) {
    query.push(args[i], pack(args[i + 1]));
  }

  // run command
  await db.mset(...query);
  return true;
}

export async function get(...args) {
  if (args.length < 1) {
    return Promise.reject("bad amount of arguments");
  }

  // check for redis db connection
  if (!(await ping())) {
    return Promise.reject("No redis connection");
  }

  // use get for single arg
  if (args.length < 2) {
    const res = await db.getBuffer(args[0]);
    return res === null ? null : unpack(res);
  }

  // use mget for multiple args
  const results = new Array();
  const res = await db.mgetBuffer(...args);
  for (let i = 0; i < res.length; i++) {
    const val = res[i];
    results.push(val === null ? null : unpack(val));
  }
  return results;
}

class Hash {
  constructor(name) {
    this.name = name;
  }

  async set(...args) {
    // check that each key gets a value
    if (args.length < 1 || args.length % 2 === 1) {
      return Promise.reject("bad amount of arguments");
    }

    // check for redis db connection
    if (!(await ping())) {
      return Promise.reject("No redis connection");
    }

    // pack values
    const query = new Array();
    for (let i = 0; i < args.length; i += 2) {
      query.push(args[i], pack(args[i + 1]));
    }

    // run command
    await db.hset(this.name, ...query);
    return true;
  }

  async get(...args) {
    if (args.length < 1) {
      return Promise.reject("bad amount of arguments");
    }

    // check for redis db connection
    if (!(await ping())) {
      return Promise.reject("No redis connection");
    }

    // use hget for single arg
    if (args.length < 2) {
      const res = await db.hget(this.name, args[0]);
      return res === null ? null : unpack(res);
    }

    // use hmget for multiple args
    const results = new Map();
    const res = await db.hmget(this.name, ...args);
    for (let i = 0; i < res.length; i++) {
      const val = res[i];
      const unpacked = val === null ? null : unpack(val);
      results.set(res[i], unpacked);
    }
    return results;
  }

  async getAll() {
    if (!(await ping())) {
      return Promise.reject("No redis connection");
    }

    const results = new Map();
    const res = await db.hgetallBuffer(this.name);
    const entries = Object.entries(res);
    for (const [key, val] of entries) {
      const unpacked = val === null ? null : unpack(val);
      results.set(key, unpacked);
    }
    return results;
  }
}

export function hash(name) {
  return new Hash(name);
}
