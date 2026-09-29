# CAN Converter

Convert CAN logs to `.trz` traces with a DBC. It runs in the browser at [app.can.zeloscloud.io](https://app.can.zeloscloud.io).

- 📋 Pick one or more `.dbc` files. A DBC is required. When two DBCs define the same message, the one picked later wins.
- 📂 Drop a CAN log: `.blf`, `.asc`, `.log`, `.csv` or `.trc`.
- ▶️ Click **Convert**. The button stays disabled until you pick a DBC and a log.
- 💾 Save the `.trz`.

## Notes

- python-can's `LogReader` reads the log. A `.csv` must use the python-can layout: `timestamp,arbitration_id,extended,remote,error,dlc,data`, with base64 `data`.
- **Log raw frames** is off by default. Turn it on to add a `can_raw` event with each frame's bytes next to the decoded signals.
