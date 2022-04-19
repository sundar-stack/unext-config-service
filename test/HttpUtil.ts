import * as rp from 'request-promise';
import { Service, ServiceUtil, ProviderFactory } from '@edunxtv2/service-util';
import { Constants } from '../src/constants/Constants';

export class HttpUtil {

  public static async call(method: string, uri: string,
    body: any, headers: any): Promise<any> {
    body = body || {};
    headers = headers || {};

    headers.instanceid = "MAB";
    headers.organizationid = "someOrg";
    headers.authorization = "eyJraWQiOiJWTE9NXC9QWHpcL1wvUnhsU3lmcmJjbnBFU2pEQWRVMVBrRHFEYnZWcW1hQ0lvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5ZDA3ZGY1Ni04ZTU3LTRlMWQtOGY4ZS1lNDhhZDM4NDhkMGEiLCJldmVudF9pZCI6IjU4ODZkMjFhLWZkMTMtNGE0NC04ZDNkLWU3NzI1YzcxNTcyYiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1NjM5NDg4NTMsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0yX21Ub1hjeEh2YSIsImV4cCI6MTU2Mzk1MjQ1MywiaWF0IjoxNTYzOTQ4ODUzLCJqdGkiOiI3ZWQwZjk5Ny01ZWQ1LTQwZGEtYmMzNC00M2RjMjg5NjUxM2MiLCJjbGllbnRfaWQiOiI2MmljYW1oZzlnMTFxbTZiOTdpaGYybHY3ZyIsInVzZXJuYW1lIjoiZHZuZHIucGF0ZWwxQGdtYWlsLmNvbSJ9.K2QITu3IQyP2BcKu0BTTMKxtK8UAGByZi-U5i3u4OKfruNZ6btO7-FJ5lZqBJgj8kSxp5LCP17hQMn84FSixhu4nGcMvvtYKuUfpdaguG1Yo_eeP848TRESawUfLiDvPk8jja0HVArryUs6x6mrJvhbzuBA-4FWJPAiW2xyni_R4HqIxS4IQeODQ2NsKYqQPoJymlbd06lVPoXNF_U4CYR5iopZxOm_0DPSsSu0qBA61qbPKTKUQRSQGIp3mCHSGr0Gb0mO25BcRUS9rq_rc07tGvZql_deVqweBZEl7GtVeLaeNVytDQmBzC_S-R8zuZuqgDDk5Vm2XCzL5_--_fg";

    //let url: string = ServiceUtil.getServiceUrl(service) + uri;
    let url: string = `http://localhost:3033/api/configservice/${uri}`;

    const result = await rp({
      method: method,
      uri: url,
      body: body,
      headers: headers,
      json: true
    });

    return result;
  }

  public static async get(uri: string, headers: any): Promise<any> {
    return await HttpUtil.call("GET", uri, {}, headers);
  }

  public static async post(uri: string, body: any, headers: any): Promise<any> {
    return await HttpUtil.call("POST", uri, body, headers);
  }

  public static async put(uri: string, body: any, headers: any): Promise<any> {
    return await HttpUtil.call("PUT", uri, body, headers);
  }

  public static async delete(uri: string, body: any, headers: any): Promise<any> {
    return await HttpUtil.call("DELETE", uri, body, headers);
  }

}
