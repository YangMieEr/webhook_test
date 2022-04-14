"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var crypto_1 = __importDefault(require("crypto"));
var app = (0, express_1.default)();
// const app2 = https.createServer(credentials, app);
app.use(express_1.default.text({ type: "application/json" }));
// Add request handler for webhook callback validation 'OPTIONS [hostname]/events'
app.options("/events", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requestedOrigin;
    return __generator(this, function (_a) {
        requestedOrigin = req.headers["webhook-request-origin"];
        console.log(requestedOrigin);
        res.setHeader("allow", ["POST"]);
        res.setHeader("webhook-allowed-origin", requestedOrigin);
        res.sendStatus(200);
        return [2 /*return*/];
    });
}); });
// Add request handler 'POST [hostname]/events'
app.post("/events", function (req, res) {
    var signatureHeader = req.headers["signature"];
    console.log(signatureHeader);
    if (!signatureHeader || !req.body)
        res.sendStatus(401);
    if (!validateSignature(req.body, signatureHeader)) {
        res.sendStatus(401);
    }
    else {
        var event_1 = JSON.parse(req.body);
        switch (event_1.contentType) {
            case "NamedVersionCreatedEvent": {
                var content = event_1.content;
                console.log("New named version (ID: ".concat(content.versionId, ", Name: ").concat(content.versionName, ") was created for iModel (ID: ").concat(content.imodelId, ")"));
                break;
            }
            case "iModelDeletedEvent": {
                var content = event_1.content;
                console.log("iModel (ID: ".concat(content.imodelId, ") in project (ID: ").concat(content.projectId, ") was deleted"));
                break;
            }
            default:
                res.sendStatus(400); //Unexpected event type
        }
    }
});
var port = 5000;
app.listen(port, function () {
    console.log("Application was started.");
});
function validateSignature(payload, signatureHeader) {
    // Replace with your own webhook secret later
    var secret = "2783d643abe9a6bba2dd407d0073662cf062ab87302dfe9f6f7f3308ace39723";
    var _a = signatureHeader.split("="), algorithm = _a[0], signature = _a[1];
    var generated_sig = crypto_1.default.createHmac(algorithm, secret).update(payload, "utf-8").digest("hex");
    return generated_sig.toLowerCase() === signature.toLowerCase();
}
