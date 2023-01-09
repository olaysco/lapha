import { ContentTypes } from "./../types";
import { onUnmounted, ref, reactive } from "vue";
import {
  WebServer,
  Response,
  Request,
} from "@awesome-cordova-plugins/web-server";
import { File } from "@awesome-cordova-plugins/file";
import { globalState } from "./useGlobalState";
declare let cordova: any;

const state = reactive({
  port: "8080",
});
export function useCreateWebServer() {
  const serverStarted = ref<boolean>(false);
  const webserver = WebServer;
  const appData = File.applicationDirectory;
  const dataDir = File.dataDirectory;
  const contentTypes: ContentTypes = {
    js: {
      name: "JavaScript",
      type: "application/javascript",
    },
    json: {
      name: "JavaScript Object Notation (JSON)",
      type: "application/json",
    },
    jpg: {
      name: "JPEG Image",
      type: "image/jpeg",
    },
    png: {
      name: "Portable Network Graphics (PNG)",
      type: "image/png",
    },
    css: {
      name: "Cascading Style Sheets (CSS)",
      type: "text/css",
    },
    html: {
      name: "HyperText Markup Language (HTML)",
      type: "text/html",
    },
    ico: {
      name: "Icon Image",
      type: "image/x-icon",
    },
  };

  const startWebServer = async () => {
    webserver.onRequest().subscribe((request: Request) => {
      console.log(request.path);
      const filePath = "public/";
      let contentType = null;
      const pathSplit = request.path.split(".");
      const ext: string = pathSplit.pop() ?? "";
      if (pathSplit.length <= 1) {
        // return index file
        respondText(request, filePath + "index.html", "text/html");
      } else if (["png, jpg, ico"].includes(ext)) {
        // handle image separately
        contentType = contentTypes[ext].type;
        respondBase64(request, filePath + request.path, contentType);
      } else {
        if (Object.keys(contentTypes).includes(ext)) {
          contentType = contentTypes[ext].type;
        }
        respondData(request, filePath + request.path, contentType);
      }
    });

    WebServer.start(40101)
      .then((e: any) => {
        serverStarted.value = true;
        globalState().httpAddress.port = JSON.parse(JSON.stringify(e)).port;
      })
      .catch((error: any) => console.error("Failed to start " + error));
  };

  const respondText = (request: Request, path: string, contentType: string) => {
    File.readAsText(appData, path).then((v) => {
      const res: Response = {
        status: 200,
        body: v,
        headers: {
          "Content-Type": contentType,
        },
      };

      webserver
        .sendResponse(request.requestId, res)
        .catch((error: any) => console.error(error));
    });
  };

  const respondData = (
    request: Request,
    path: string,
    contentType: string | null
  ) => {
    File.readAsBinaryString(appData, path).then((data) => {
      const res: Response = {
        status: 200,
        body: data,
        headers: {},
      };

      if (contentType) {
        res.headers["Content-Type"] = contentType;
      }

      webserver
        .sendResponse(request.requestId, res)
        .catch((error: any) => console.error(error));
    });
  };

  const respondBase64 = (
    request: Request,
    path: string,
    contentType: string
  ) => {
    File.readAsDataURL(appData, path).then((data) => {
      const res: Response = {
        status: 200,
        body: data,
        headers: {},
      };

      if (contentType) {
        res.headers["Content-Type"] = contentType;
      }

      webserver
        .sendResponse(request.requestId, res)
        .catch((error: any) => console.error(error));
    });
  };

  const stopWebServer = async () => {
    await WebServer.stop();
    serverStarted.value = false;
  };

  onUnmounted(() => stopWebServer());

  return {
    stopWebServer,
    startWebServer,
  };
}
