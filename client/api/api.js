import axios from "axios";

export const getInstance = (ctx) => {
  const req = ctx?.req;
  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    return axios;
  } else {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      ...(req && { headers: req.headers }),
    });
  }
};

class Api {
  /**
   * Send a GET request to the API
   * @param {String} route
   * @param {Object} ctx - next context
   * @param {String} params
   */
  static async get(route, ctx, params) {
    const instance = getInstance(ctx);
    let data = {},
      errors = null;
    console.log("GET " + route);

    try {
      const res = await instance.get(route, params);
      data = res?.data;
    } catch (err) {
      errors = err?.response?.data?.errors;
    }

    return { data, errors };
  }
  /**
   * Send a POST request to the API
   * @param {String} route
   * @param {Object} ctx - next context
   * @param {Object} params
   */
  static async post(route, ctx, params) {
    const instance = getInstance(ctx);
    let data = {},
      errors = null;
    console.log("POST " + route, params);

    try {
      const res = await instance.post(route, params);
      data = res?.data;
    } catch (err) {
      errors = err?.response?.data?.errors;
    }

    return { data, errors };
  }
}

export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51JKn9ASDFeGt7Nl5EO3dbt4KdVyPUa7GcumZTLctAUsNgUR5e3rZ2xjJKQtm9rvBtdjz4SLtuLUfyxpzIOt2k6O9008WDMZCIr";

export default Api;
