const stringify = require('querystring').stringify;
var settings = require('ep_etherpad-lite/node/utils/Settings');

exports.registerRoute = (hookName, args) => {
  args.app.get("/auth_session", function(req, res) {
    let r = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">' + "\n";

    r += '<html>' + "\n";
    r += '<head>' + "\n";
    r += '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">' + "\n";
    r += '</head>' + "\n";
    r += '<body>' + "\n";
    r += '<script type="text/javascript">' + "\n";

    if (req.query.sessionID) {
      r += 'document.cookie = "sessionID=' + encodeURIComponent(req.query.sessionID) + '; path=/; SameSite=None; Secure;";' + "\n";
    }

    if (req.query.padName) {
      let redirectUrl = '/p/';

      if (req.query.groupID) {
        redirectUrl += encodeURIComponent(req.query.groupID) + '$';
      }

      redirectUrl += encodeURIComponent(req.query.padName);

      const query = {};

      for (const queryKey in req.query) {
        if (!req.query.hasOwnProperty(queryKey) || queryKey === "sessionID" || queryKey === "groupID" || queryKey === "padName") {
          continue;
        }
        
        query[queryKey] = req.query[queryKey];
      }

      let padOptions = {};
      Object.keys(settings.padOptions).forEach(function(option) {
          if (option in req.query) {
              padOptions[option] = req.query[option];
          }
      });
      if (Object.keys(query).length > 0) {
        if (document.location.protocol == 'https:') {
            r += "document.cookie = 'prefs=" + JSON.stringify(padOptions) + "; path=/; SameSite=None; Secure;';\n";
        } else {
            r += "document.cookie = 'prefsHttp=" + JSON.stringify(padOptions) + "; path=/; SameSite=None; Secure;';\n";
        }
        redirectUrl += "?" + stringify(query);
      }

      r += 'document.location.href="' + redirectUrl + '";' + "\n";
    }

    r += '</script>' + "\n";
    r += '</body>' + "\n";
    r += '</html>' + "\n";

    res.send(r);
  });
};
