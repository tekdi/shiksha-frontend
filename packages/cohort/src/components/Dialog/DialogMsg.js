import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Button, Box } from "native-base";
import { IconByName } from "@shiksha/common-lib";

export default function DialogMsg(props) {
  return (
    <div>
      <Dialog
        open={props.modalShow}
        onClose={props.modalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          style={{
            paddingLeft: "53px",
            paddingRight: "53px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <Box className="alert_dec">
            <Box style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <IconByName
                name="CheckboxCircleLineIcon"
                color={"profile.present"}
                _icon={{
                  size: "47px",
                }}
              />{" "}
            </Box>

            <Box style={{ alignItems: "center", color: "green" }}>
              <span>{props.message}</span>
            </Box>
            <Box style={{ marginTop: "15px", alignItems: "center" }}>
              <span>{props.description}</span>
            </Box>
          </Box>

          <DialogActions
            style={{
              display: "inline-block",
              justifyContent: "center !important",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center !important",
              }}
            >
              <Box>
                <Button color="primary" onPress={props.clickOk}>
                  Ok
                </Button>
              </Box>
              {props.showCancel && (
                <Button onClick={props.modalClose} color="primary" autoFocus>
                  Cancel
                </Button>
              )}
            </Box>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
