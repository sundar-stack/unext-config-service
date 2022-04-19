/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-lines-per-function */
import 'reflect-metadata';
import { expect } from 'chai';
import * as _ from 'lodash';
import 'mocha';
import { TestUtils } from '@edunxtv2/service-util';
import { HttpUtil } from './HttpUtil';

require('dotenv').config();

beforeEach(async () => {
  await HttpUtil.delete("domainconfiguration/clearAll", {}, {});
});

describe("The Domain Configuration and Login page Put  API", async () => {
  it("throws an error Domain Name Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "The provided domain is not supported"`, async () => {
      await HttpUtil.get("domainconfiguration/asdasd", {});
    });
  });

  it("throws error on the Org configurations when the appropriate orgId is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "orgId may not be null, undefined or blank"`, async () => {
      await HttpUtil.put(
        "domainconfiguration/loginPageSettings",
        {
          apiBaseUrl: "https://edunxtdev01.unext.tech",
          welcomeText: "welcometext",
          ssoText: "ssoText",
          supportText: "supportText",
          logoRedirectUrl: "<the redirect url>",
          headerText: "<p>Welcome to Unext<p>",
          bannerImageUrl: "<the url for the image>",
        },
        {}
      );
    });
  });

  it("throws error on the Org configurations when apiBaseUrl is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "apiBaseUrl may not be null, undefined or blank"`, async () => {
      await HttpUtil.put(
        "domainconfiguration/loginPageSettings",
        {
          orgId: "capgemeni",
          welcomeText: "welcometext",
          ssoText: "ssoText",
          supportText: "supportText",
          logoRedirectUrl: "<the redirect url>",
          headerText: "<p>Welcome to Unext<p>",
          bannerImageUrl: "<the url for the image>",
        },
        {}
      );
    });
  });

  it("throws error on the Org configurations if poweredByUnextLogo is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "poweredByUnextLogo may not be null or undefined"`, async () => {
      await HttpUtil.put(
        "domainconfiguration/loginPageSettings",
        {
          orgId: "capgemeni",
          welcomeText: "welcometext",
          apiBaseUrl: "https://edunxtdev01.unext.tech",
          ssoText: "ssoText",
          supportText: "supportText",
          logoRedirectUrl: "<the redirect url>",
          headerText: "<p>Welcome to Unext<p>",
          bannerImageUrl: "<the url for the image>",
        },
        {}
      );
    });
  });

  it("updates the Org configurations with the appropriate Orgs, Domain Name, Context, attribname and value", async () => {
    const response = await HttpUtil.put(
      "domainconfiguration/loginPageSettings",
      {
        orgId: "capgemeni",
        apiBaseUrl: "https://edunxtdev01.unext.tech",
        welcomeText: "welcometext",
        ssoText: "ssoText",
        supportText: "supportText",
        logoRedirectUrl: "<the redirect url>",
        headerText: "<p>Welcome to Unext<p>",
        bannerImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1418&q=80",
        poweredByUnextLogo: true,
      },
      {}
    );
    expect(_.isEqual({ status: "success" }, response));
  });

  it("throws and error if context is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "context may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateProductConfiguration", { attribName: "defaultHeaderText", value: "Welcome to your online learning environment. Wish you an amazing experience ahead !!" }, {});
    });
  });

  it("throws and error if attribName is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "attribName may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateProductConfiguration", { context: "loginPage", value: "Welcome to your online learning environment. Wish you an amazing experience ahead !!" }, {});
    });
  });

  it("throws and error if value is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "value may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateProductConfiguration", { context: "loginPage", attribName: "defaultHeaderText" }, {});
    });
  });

  it("updates the Product configurations with the appropriate context,attribName and value", async () => {
    const response = await HttpUtil.put("domainconfiguration/updateProductConfiguration", { context: "loginPage", attribName: "defaultHeaderText", value: "Welcome to your online learning environment. Wish you an amazing experience ahead !!" }, {});
    expect(_.isEqual({ status: "success" }, response));
  });

  it("creates the domain configurations with the appropriate configurationId, Domain Name and configuration", async () => {
    const response = await HttpUtil.post("domainconfiguration/createConfiguration", { domain: "edunxtdev01.unext.tech", apiBaseUrl: "https://capegemeni.edunxtdev01.unext.tech", orgId: "capgemeni" }, {});
    expect(_.isEqual({ status: "success" }, response));
    const authResponse: any = await HttpUtil.get("domainconfiguration/edunxtdev01.unext.tech", {});
    expect(authResponse.apiBaseUrl).to.not.be.undefined;
  });
});

describe("Update Domain configuration API Configs", async () => {
  it("throws and error if domain is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "domain may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateApiConfiguration", { apiBaseUrl: "https://capegemeni.edunxtdev01.unext.tech", orgId: "capegemeni" }, {});
    });
  });

  it("throws and error if apiBaseUrl is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "apiBaseUrl may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateApiConfiguration", { domain: "edunxtdev01.unext.tech", orgId: "capegemeni" }, {});
    });
  });

  it("throws and error if orgId is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "orgId may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateApiConfiguration", { domain: "edunxtdev01.unext.tech", apiBaseUrl: "https://capegemeni.edunxtdev01.unext.tech" }, {});
    });
  });

  it("updates the Product configurations with the appropriate context,attribName and value", async () => {
    const response = await HttpUtil.put("domainconfiguration/updateApiConfiguration", { domain: "edunxtdev01.unext.tech", apiBaseUrl: "https://capegemeni.edunxtdev01.unext.tech", orgId: "capegemeni" }, {});
    expect(_.isEqual({ status: "success" }, response));
  });
});

describe("Update Domain Configuration API Configs", async () => {
  it("throws and error if domain is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "domain may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateApiConfiguration", { apiBaseUrl: "https://capegemeni.edunxtdev01.unext.tech", orgId: "capegemeni" }, {});
    });
  });

  it("throws and error if apiBaseUrl is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "apiBaseUrl may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateApiConfiguration", { domain: "edunxtdev01.unext.tech", orgId: "capegemeni" }, {});
    });
  });

  it("throws and error if orgId is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "orgId may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/updateApiConfiguration", { domain: "edunxtdev01.unext.tech", apiBaseUrl: "https://capegemeni.edunxtdev01.unext.tech" }, {});
    });
  });

  it("updates the Product configurations with the appropriate context,attribName and value", async () => {
    const response = await HttpUtil.put("domainconfiguration/updateApiConfiguration", { domain: "edunxtdev01.unext.tech", apiBaseUrl: "https://capegemeni.edunxtdev01.unext.tech", orgId: "capegemeni" }, {});
    expect(_.isEqual({ status: "success" }, response));
  });
});

describe("fetching login Page Settings", async () => {
  it("throws an error Org Id Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "The provided Org Id is not supported"`, async () => {
      await HttpUtil.get("domainconfiguration/loginPageSettings/asdad", {});
    });
  });

  it("fetches the data when appropriate Org Id is provided", async () => {
    const result = await HttpUtil.get("domainconfiguration/loginPageSettings/capgemeni", {});
    expect(result.defaultHeaderText).to.not.be.undefined;
  });
});

describe("Update Branding Page Settings", async () => {
  it("throws an error ,If orgId Provided is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "orgId may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "", bannerType: "vertical", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "welcome ", announcementMessage: "new laert", poweredByUnextLogo: "true", screenDuration: "3", announcementStatus: "true" }, {});
    });
  });

  it("throws an error ,If headerText Provided is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "headerText may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "vertical", profilePicUrl: "test.jpg", greetingsText: "welcome ", announcementMessage: "new laert", poweredByUnextLogo: "true", screenDuration: "3", announcementStatus: "true" }, {});
    });
  });

  it("throws an error ,If bannerType Provided is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "bannerType may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "welcome ", announcementMessage: "new laert", poweredByUnextLogo: "true", screenDuration: "3", announcementStatus: "true" }, {});
    });
  });

  it("throws an error ,If greetingsText Provided is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "greetingsText may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "vertical", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "", announcementMessage: "new laert", poweredByUnextLogo: "true", screenDuration: "3", announcementStatus: "true" }, {});
    });
  });

  it("throws an error ,If announcementStatus Provided is empty", async () => {
    await TestUtils.verifyAsyncError(`400 - "announcementStatus may not be null or undefined"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "vertical", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "welcome ", announcementMessage: "", poweredByUnextLogo: true, screenDuration: "3" }, {});
    });
  });

  it("throws an error ,If screenDuration Provided is negative integer", async () => {
    await TestUtils.verifyAsyncError(`400 - "screenDuration must be a positive integer"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "vertical", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "welcome ", announcementMessage: "new laert", poweredByUnextLogo: "true", screenDuration: -21, announcementStatus: "true" }, {});
    });
  });

  it("throws an error ,If screenDuration Provided is string", async () => {
    await TestUtils.verifyAsyncError(`400 - "screenDuration must be an integer"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "vertical", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "welcome ", announcementMessage: "", poweredByUnextLogo: true, screenDuration: "3", announcementStatus: "true" }, {});
    });
  });

  it("Update the Brandingpage details", async () => {
    const response = await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "vertical", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "welcome ", announcementMessage: "new laert", poweredByUnextLogo: "true", screenDuration: 3, announcementStatus: "true" }, {});
    expect(_.isEqual({ status: "success" }, response));
  });

  it("throws an error ,If announcementStatus NOT Provided as Boolean", async () => {
    await TestUtils.verifyAsyncError(`500 - "announcementStatus should be of type boolean"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "vertical", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "welcome ", announcementMessage: "announcementMessage", poweredByUnextLogo: true, screenDuration: 3, announcementStatus: "true" }, {});
    });
  });

  it("throws an error ,If poweredByUnextLogo NOT Provided as Boolean", async () => {
    await TestUtils.verifyAsyncError(`500 - "poweredByUnextLogo should be of type boolean"`, async () => {
      await HttpUtil.put("domainconfiguration/brandingPageSettings", { orgId: "tcs", bannerType: "vertical", profilePicUrl: "test.jpg", headerText: "123", greetingsText: "welcome ", announcementMessage: "announcementMessage", poweredByUnextLogo: "true", screenDuration: 3, announcementStatus: true }, {});
    });
  });
});

describe("fetching generic Settings based on context", async () => {
  it("throws an error Org Id Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "The provided Org Id or Context is not supported"`, async () => {
      await HttpUtil.get("domainconfiguration/genericSettings/sample/loginPage", {});
    });
  });

  it("throws an error Context Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "The provided Org Id or Context is not supported"`, async () => {
      await HttpUtil.get("domainconfiguration/genericSettings/capgemeni/sample", {});
    });
  });

  it("fetches the data when appropriate Org Id and context are provided", async () => {
    const result = await HttpUtil.get("domainconfiguration/genericSettings/capgemeni/loginPage", {});
    expect(result.defaultHeaderText).to.not.be.undefined;
  });
});

describe("getting Binary data of COnfig & settings Images", async () => {
  it("throws an error if the image content is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "Image Data not found"`, async () => {
      await HttpUtil.get("domainconfiguration/imageContent/brandingBanneHorizontalImageContent?orgId=capgemini&hash=13e6f01c97fe7655cf8d0bc0a37fe85782aadfd7340b4eadf0e8a644453d49b3", {});
    });
  });

  it("throws an error if orgId is not passed as a parameter", async () => {
    await TestUtils.verifyAsyncError(`400 - "orgId may not be null, undefined or blank"`, async () => {
      await HttpUtil.get("domainconfiguration/imageContent/brandingBannerHorizontalImageContent?hash=13e6f01c97fe7655cf8d0bc0a37fe85782aadfd7340b4eadf0e8a644453d49b3", {});
    });
  });

  it("throws an error if hash is not passed as a parameter", async () => {
    await TestUtils.verifyAsyncError(`400 - "hash may not be null, undefined or blank"`, async () => {
      await HttpUtil.get("domainconfiguration/imageContent/brandingBannerHorizontalImageContent?orgId=capgemini", {});
    });
  });

  it("fetches the Image data when appropriate Org Id and context are provided", async () => {
    await HttpUtil.put(
      "domainconfiguration/imageContent",
      {
        orgId: "capgemini",
        imageName: "dummyImageName",
        imageContent:
          "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",
      },
      {}
    );
    const result = await HttpUtil.get("domainconfiguration/imageContent/dummyImageNameContent?orgId=capgemini&hash=13e6f01c97fe7655cf8d0bc0a37fe85782aadfd7340b4eadf0e8a644453d49b3", {});
    expect(result).to.not.be.undefined;
  });
});
describe("Updating imagecontent along with hash", async () => {
  it("throws an error Org Id Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "orgId may not be null, undefined or blank"`, async () => {
      await HttpUtil.put(
        "domainconfiguration/imageContent",
        {
          orgId: "",
          imageName: "brandingpageimage",
          imageContent:
            "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",
        },
        {}
      );
    });
  });

  it("throws an error when imageName Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "imageName may not be null, undefined or blank"`, async () => {
      await HttpUtil.put(
        "domainconfiguration/imageContent",
        {
          orgId: "capgemini",
          imageName: "",
          imageContent:
            "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",
        },
        {}
      );
    });
  });

  it("throws an error when imageContent Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "imageContent may not be null, undefined or blank"`, async () => {
      await HttpUtil.put("domainconfiguration/imageContent", { orgId: "capgemini", imageName: "brandingpageimage", imageContent: "" }, {});
    });
  });

  it("Successfully creates hash when all values are passed as expected", async () => {
    const result = await HttpUtil.put(
      "domainconfiguration/imageContent",
      {
        orgId: "capgemini",
        imageName: "brandingPageImage",
        imageContent:
          "iVBORw0KGgoAAAANSUhEUgAAAIgAAAAoCAMAAAASeEKOAAAA7VBMVEX////39vbMzMzDw8P6+fn8+/vn5+cAAAD+/v7b29u0tLSvr6/f39/x8PDR0dE0NDS+vr7IyMiEhITt7e3U1NSmpqbj4+P08/NnZ2d7e3u5ubkODg51dXVdXV0aGhrUw73h1dEGBgZubm7EraXx7Orcz8vPvLbKta48PDzm3Nnq4uCioqK5SCNGRkZQUFCLi4uYmJidnZ3X19fv5uSsjH/ay8UpKSmTk5PpZCTiVCa7opjNUSSQkJC/qJ+1mI7dXyTKw8HZlnyfd2jfqpKrq6vRiWvgs6LwbSTNXiyxZFCfOiKpqamdj4vLmYvRc0qiFeV0AAAIIElEQVRYw+2XaXPiOhaGZVuyvOMFbDAYGxtslrDYbBkCpDqX7ixU9///Ofd4gXRu0jO3p+509YdRFYktydKjc857JCH0uxbhN+EYffpj+TtwME/3t0/Bb2AV5+nx8fFp/RuY5NP94+PtN+HvB4uq/eQMLPn37f3RKJ9a/Xb7eH8T5BXB+PoJmYTD2syp3rTacGZmZcO2O8VFjC+8YS1kCqvOm8Op6ZreELqJ8+lw2mlOZ6lafMDVunbxkLWGw2Fn77zzyWjQLx6Cm6e7lzifIwj612ai1Ch1qxeT0hNTGsyq0V5hEgHXu7RnFrW43m4yBKeUbrHAhLSrWXK75xWUHUrTUp3OjLa1d9YhoziuKpefn59zAiGIB6+8eEaph8tHmJy72LnWo63KibMe7U1Kklo+mQS88G9Lu2IO0K3nLdM2rTFl/yZti+8cM/bXuekIhsKM++Vwvj/CV5Bpl1ZGPdXKGfIyX2xorTS60DTbtGuUII2/gpx6PQleDM+jPfbHIDj2I+I/37yW5+eIWSfRNac4Q7NH50UUbeaUzi+1dZO2LwOz2x5Y+2MQqdeTc9gF16PmD0GEINqN0PPN3f39v/Jyd3d38/ISO1HiX0xibbhNaRKpplHaKWv1ocO1L1RN1oEIGFofgqS9NriG32TMhk7Jj0Bw5O9U9PWm4ihQbl4eSBIf1KqLvbHBEIt8UZLdprPCeSQ0YWxawxUIEjxKp+oHIMyMziA03BmB+bv8j0DGSRQLiPnydFsVILl5OaJgl8RVl6ymWrAWjJQZo3bpsJhbnWYIg9ONCwhShpQ2yV9B2LPXDXNrtqD+3KPbH4EM4kORTD8/3t7dww9Ibp4TjMbHJKhMwg4ZiPy2JoARHDBCoSet63keTB0KFxCIIAigdyCS4ZRBPPO8KaUb5mMQ4h+icZFWbz/3Pz9+W366/VakECc6RBWIOyQIwsHLQIWg342Vh5Y5a0Hp0pp1BUEcpJP0fYxU2awD/WuVCd+DjB/8XQly/wf64/4z+gK/YgtcrVeVbxoz4ALdNj1Y/bAMW6fGCVA6lW5KEAFw290PQYjXyvu7tNTNexAcRbv1K8gn9OWuABHGyWFXCXgb5kODPPPUPqW9fAh3U0SdW+nGq2S86FH6IYi9KfJgrhvhOxC8vUizn0TRMW/69PQGBMWrJB6VfTpmmVNnufTCIq+TjkfK8YtkSYZVusXmG5A97WaVe8vIQh5t29+B1MPrIeR4OPoDIPl6ByBPV5C+v4pWo3KLrc0UGGVOJzCRAhZJeZXbdHggwRk4PVX5U7uplMkbRNxAhAeejo3tWd4Z1ozF2TDvIPCQbUKbEeGzvaax5435upX3o9EK+n69AZA7ALkpQKI4CZbFol2z1ZpDhNXzsLTNEGJuLpmd1r547UBxt/DHLHWM+GmKrLw6NJV52Om0TAX6zTutOSQ1Z9+ChjTreM2wtTdbnme8yncVJQ/LPkpeBgDxFfkvX2EFy+MxXh3wW4H9vTMHwf/dIRgHa8gkK4LHAlK/LJHzFQ4k/i44DNb9X3suU9dREq+C4HUFzhqUFPkXDtFAjNTQUKYJ0olj9EmqNlSk6RKn6sUHjGzJhj3RU16cTLJU4WSpkWppg0e40ZhoDZnnJ4rGOVJDRIbDzc35eWKxKctPeFVWX0nWu8Q/DFb4Ynqc5Bi7pDqQkHOIU5ZwODWFhcI25b3NmKYT6lmogfsdGy/qaJE5Xn2qbwkvTlV7zzYUe+Y2BdSR6uLCCQ0P826zLtSFVkMlHcKFZ5nsdTO09O/8KPTHx13/oR+V9kiCYxyvBle/WFzIt/LA1EO8UJzawptgaeqeJZTCsciZcMYco725n9anW5Y41nA/nxtN0xp6oNNOKIsLOLkAiDyEldnnGiYdxIYtBRmplHr6m3vE7pj4EfMwKA5pkGrjeLcaXVrrxl5f6IRltRa7FbVQnls2ly64E9JBe6wuuXCMXGTqDCxiOkMut4gxsZTp3sRgEZvdOh3W4zOjaRCxYcy0AmSS4gl3wnvzbaCPDw+rwdEvblkrf/WwCq6hL+g8e1Ldk+aqnCzLHGOcz3VXtTmJ6CeMsKFlIiKSYadcytfPaX1hG7Keno2JcrKxPDmzE9cWxJQjMIjRsE6cOHHYiWXIdb5h4fpfJBcfEv9YWGS8gog5/IxgRPWfUQ0pgtQ5PjwcE0Hwdw9gj5+7Mf8zl0O8Xhck4yjpL1fHgeNHa6FwV3m1ERTxf1mU6yr640G/EioTDYJDFaR4PPKXv/YePAqCUT9ffP8IkSEko+LKtE5GI/JrM6vgjIO+38eXvAp/hQGzDi76xYpylRBfPCl5dlFs2BLKY/T1KgZVcC/MX3FRZ+U7vuUIuTR4W1Rty1KwUN6QGMdmFJVRhTfbzSBe+wNMCBFgz1qOmOVoeb3V2LrIYcJgBmNSRyLGggZPYmZj7OC8FlsiFvInojEMtlmHIbydX9YQlgRMDMJy8IGWZToWZYaoW4JFJLgcq2mWYfNvwn7MJINkFI/WI7SOx7FARsy10ZAsyZX000RyOQ5xJ8j2E5dneWXrng1Xb0i6pMu8rC8kVtZl0Ul1XXOh7+mMeI7Xdc466Q3d4mxF4g0DC2JDEzkB6bauuJLB8u8vwIG/HAzQOliume8pDUmzOElTNNaQOcQaCmF5jti6nXE6W8/qOivZBtYNRXJ1XRREjoNkx2V1g8Uaz7CsbXNaBkmVYzKONzQCn2UG7BK8rdQVlhU+iJX+MujDQeltk6D+52OF5fy4jccf5S7nOin6f/mg/An0OPQXT0/jzAAAAABJRU5ErkJggg==",
      },
      {}
    );
    expect(result).to.not.be.undefined;
    it("fetches the data when appropriate Org Id is provided", async () => {
      const result = await HttpUtil.get("domainconfiguration/genericSettings/capgemini/brandingPage", {});
      expect(result.brandingPageImage_URL).to.not.be.undefined;
    });
  });
});

describe("Deleteing Image and Hash DELETE API in Org Config Level", async () => {
  it("throws an error Org Id Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "orgId may not be null, undefined or blank"`, async () => {
      await HttpUtil.delete("domainconfiguration/imageContent", { "orgId": "", "imageName": "brandingpageimage" }, {});
    });
  });

  it("throws an error when imageName Provided is not valid", async () => {
    await TestUtils.verifyAsyncError(`400 - "imageName may not be null, undefined or blank"`, async () => {
      await HttpUtil.delete("domainconfiguration/imageContent", { "orgId": "capgemini", "imageName": "" }, {});
    });
  });

  it("throws an error when imageName and orgId is not found", async () => {
    await TestUtils.verifyAsyncError(`400 - "Image Data not found"`, async () => {
      await HttpUtil.delete("domainconfiguration/imageContent", { "orgId": "capgemini", "imageName": "invalidImageContext" }, {});
    });
  });

  it("Successfully deletes the content and hash and returns status success when valid imageName is passed", async () => {
    await HttpUtil.put("domainconfiguration/imageContent", { "orgId": "capgemini", "imageName": "dummyImageName", "imageContent": "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" }, {});
    const result = await HttpUtil.delete("domainconfiguration/imageContent", { "orgId": "capgemini", "imageName": "dummyImageName" }, {});
    expect(_.isEqual({ status: 'success' }, result));
  });
});
