import React from "react";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Button, Box, Select, CheckIcon, Text } from "native-base";
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
              <IconByName
                name="CloseCircleLineIcon"
                style={{
                  color: "rgb(245, 123, 123) !important",
                  cursor: "none !important",
                }}
                _icon={{
                  size: "47px",
                }}
              />
            </Box>
            <Box
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                alignItems: "center",
              }}
            >
              <span>{props.description}</span>
            </Box>
          </Box>

          <DialogActions
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              color="primary"
              onPress={props.clickOk}
              style={{
                backgroundColor: "rgb(248, 117, 88) !important",
                marginRight: "10px",
              }}
            >
              Submit
            </Button>
            {props.showCancel && (
              <Button
                onPress={props.modalClose}
                style={{ backgroundColor: "rgb(248, 117, 88) !important" }}
                autoFocus
              >
                Cancel
              </Button>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
