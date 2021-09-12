const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iMzcuMjUiCiAgIGhlaWdodD0iNDIuMjIzNzMiCiAgIHZpZXdCb3g9IjAsMCwzNy4yNSw0Mi4yMjM3MyIKICAgaWQ9InN2ZzE0IgogICBzb2RpcG9kaTpkb2NuYW1lPSIwNjUyNTMyZDcwMWNiMTNhMmU3OTdjMGIwNDIzYjUwZS5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMC4yLTIgKGU4NmM4NzA4NzksIDIwMjEtMDEtMTUpIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyMCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczE4IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTg1OCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDU3IgogICAgIGlkPSJuYW1lZHZpZXcxNiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMjEuMDc4MTk2IgogICAgIGlua3NjYXBlOmN4PSIxOC42MjUiCiAgICAgaW5rc2NhcGU6Y3k9IjMzLjczMTU0IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcxNCIgLz4KICA8ZwogICAgIGlkPSJnODcyIj4KICAgIDxwYXRoCiAgICAgICBkPSJNIDAsMzYuODU0NjQgQyAwLDI5LjA2MjI5IDAsMTAuMjU4MTUgMCw2LjEwNDY0IDAsNC41MTU3OCAxLjU2MDI3LDMuMDAzMDggMy4xODc1LDMuMDAzMDggYyA0LjIyNjQ3LDAgMjMuMjQwMzcsMCAzMC44NzUsMCAxLjk3NDE5LDAgMy4xODc1LDEuNTgxOTcgMy4xODc1LDMuMjI2NTYgMCw0LjI3Mjc5IDAsMjMuNDg3ODkgMCwzMSAwLDEuODc3MDYgLTEuNjI5ODYsMy4wMjM0NCAtMy4zMTI1LDMuMDIzNDQgLTQuMjUyMjIsMCAtMjIuOTQ0NTYsMCAtMzAuNjI1LDAgQyAxLjI2NDkyLDQwLjI1MzA4IDAsMzguOTUzMTkgMCwzNi44NTQ2NCBaIgogICAgICAgZmlsbD0iIzMxOWJmZiIKICAgICAgIHN0cm9rZT0iIzMxOWJmZiIKICAgICAgIHN0cm9rZS13aWR0aD0iMCIKICAgICAgIGlkPSJwYXRoMiIKICAgICAgIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpub3JtYWw7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjAiIC8+CiAgICA8cGF0aAogICAgICAgZD0ibSAxNS45NzYxMjcsMTEuOTY1MzY1IHEgMCwzLjIzNzIxMyAtMS4wMTcxNzksNC43NTQ5MDkgLTEuMDA5MTA2LDEuNTA5NjIzIC0zLjE0MDMzOSwxLjUwOTYyMyAtMi4xNjM1MjQyLDAgLTMuMTY0NTU3NywtMS41MzM4NDEgLTAuOTkyOTYwNywtMS41MzM4NDIgLTAuOTkyOTYwNywtNC43MTQ1NDUgMCwtMy4yMDQ5MjIzIDEuMDA5MTA2NCwtNC43MzA2OTEyIDEuMDA5MTA2NCwtMS41MzM4NDE4IDMuMTQ4NDEyLC0xLjUzMzg0MTggMi4xNjM1MjQsMCAzLjE1NjQ4NSwxLjU1ODA2MDMgMS4wMDEwMzMsMS41NDk5ODc1IDEuMDAxMDMzLDQuNjkwMzI2NyB6IG0gLTIuMTIzMTYsMy42NjUwNzQgcSAwLjI4MjU1LC0wLjY1MzkwMSAwLjM3OTQyNCwtMS41MzM4NDEgMC4xMDQ5NDgsLTAuODg4MDE0IDAuMTA0OTQ4LC0yLjEzMTIzMyAwLC0xLjIyNzA3MyAtMC4xMDQ5NDgsLTIuMTMxMjMyOCBRIDE0LjEzNTUxNyw4LjkyOTk3MjggMTMuODQ0ODk1LDguMzAwMjkwNCAxMy41NjIzNDUsNy42Nzg2ODA5IDEzLjA2OTkwMSw3LjM2MzgzOTcgMTIuNTg1NTMsNy4wNDg5OTg1IDExLjgxODYwOSw3LjA0ODk5ODUgcSAtMC43NTg4NDgsMCAtMS4yNTkzNjUsMC4zMTQ4NDEyIC0wLjQ5MjQ0NCwwLjMxNDg0MTIgLTAuNzgzMDY2NCwwLjk1MjU5NjQgLTAuMjc0NDc2OSwwLjU5NzM5MSAtMC4zNzk0MjQsMS41NTgwNjAzIC0wLjA5Njg3NCwwLjk2MDY2OTYgLTAuMDk2ODc0LDIuMTA3MDE0NiAwLDEuMjU5MzY0IDAuMDg4ODAxLDIuMTA3MDE0IDAuMDg4ODAxLDAuODQ3NjQ5IDAuMzc5NDI0LDEuNTE3Njk2IDAuMjY2NDA0NCwwLjYyOTY4MiAwLjc1MDc3NTQsMC45NjA2NjkgMC40OTI0NDQsMC4zMzA5ODcgMS4yOTk3MjksMC4zMzA5ODcgMC43NTg4NDgsMCAxLjI1OTM2NSwtMC4zMTQ4NDEgMC41MDA1MTcsLTAuMzE0ODQxIDAuNzc0OTkzLC0wLjk1MjU5NyB6IgogICAgICAgc3R5bGU9ImZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXNpemU6MTYuNTMzMnB4O2ZvbnQtZmFtaWx5OidTYW5zIFNlcmlmJzt0ZXh0LWFuY2hvcjpzdGFydDttaXgtYmxlbmQtbW9kZTpub3JtYWw7ZmlsbDojZmZmZmZmO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQxMzMzO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowIgogICAgICAgaWQ9InBhdGg4NTQiIC8+CiAgICA8cGF0aAogICAgICAgZD0ibSAzMS42MjkzODYsMTcuOTc5NjM5IGggLTYuNTA2NzE4IHYgLTEuMjI3MDczIGggMi41MDI1ODQgViA4LjY5NTg2MDEgSCAyNS4xMjI2NjggViA3LjU5Nzk1MjQgcSAwLjUwODU4OSwwIDEuMDg5ODM1LC0wLjA4MDcyOCAwLjU4MTI0NSwtMC4wODg4MDEgMC44Nzk5NCwtMC4yNTAyNTg0IDAuMzcxMzUyLC0wLjIwMTgyMTMgMC41ODEyNDYsLTAuNTA4NTg5NyAwLjIxNzk2NywtMC4zMTQ4NDExIDAuMjUwMjU4LC0wLjgzOTU3NjUgaCAxLjI1MTI5MiBWIDE2Ljc1MjU2NiBoIDIuNDU0MTQ3IHoiCiAgICAgICBzdHlsZT0iZm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc2l6ZToxNi41MzMycHg7Zm9udC1mYW1pbHk6J1NhbnMgU2VyaWYnO3RleHQtYW5jaG9yOnN0YXJ0O21peC1ibGVuZC1tb2RlOm5vcm1hbDtmaWxsOiNmZmZmZmY7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNDEzMzM7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjAiCiAgICAgICBpZD0icGF0aDg1NiIgLz4KICAgIDxwYXRoCiAgICAgICBkPSJNIDE1LjMwNjA4MSwzNy4wNTQ4MTkgSCA4Ljc5OTM2MjYgViAzNS44Mjc3NDYgSCAxMS4zMDE5NDYgViAyNy43NzEwNCBIIDguNzk5MzYyNiB2IC0xLjA5NzkwOCBxIDAuNTA4NTg5NiwwIDEuMDg5ODM0OSwtMC4wODA3MyAwLjU4MTI0NTUsLTAuMDg4OCAwLjg3OTk0MDUsLTAuMjUwMjU4IDAuMzcxMzUxLC0wLjIwMTgyMiAwLjU4MTI0NiwtMC41MDg1OSAwLjIxNzk2NywtMC4zMTQ4NDEgMC4yNTAyNTgsLTAuODM5NTc3IGggMS4yNTEyOTIgdiAxMC44MzM3NjcgaCAyLjQ1NDE0NyB6IgogICAgICAgc3R5bGU9ImZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXNpemU6MTYuNTMzMnB4O2ZvbnQtZmFtaWx5OidTYW5zIFNlcmlmJzt0ZXh0LWFuY2hvcjpzdGFydDttaXgtYmxlbmQtbW9kZTpub3JtYWw7ZmlsbDojZmZmZmZmO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQxMzMzO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowIgogICAgICAgaWQ9InBhdGg4NTgiIC8+CiAgICA8cGF0aAogICAgICAgZD0ibSAzMi4yOTk0MzIsMzEuMDQwNTQ1IHEgMCwzLjIzNzIxMyAtMS4wMTcxNzksNC43NTQ5MDkgLTEuMDA5MTA2LDEuNTA5NjIzIC0zLjE0MDMzOSwxLjUwOTYyMyAtMi4xNjM1MjQsMCAtMy4xNjQ1NTgsLTEuNTMzODQxIC0wLjk5Mjk2LC0xLjUzMzg0MiAtMC45OTI5NiwtNC43MTQ1NDUgMCwtMy4yMDQ5MjIgMS4wMDkxMDYsLTQuNzMwNjkxIDEuMDA5MTA3LC0xLjUzMzg0MiAzLjE0ODQxMiwtMS41MzM4NDIgMi4xNjM1MjQsMCAzLjE1NjQ4NSwxLjU1ODA2IDEuMDAxMDMzLDEuNTQ5OTg4IDEuMDAxMDMzLDQuNjkwMzI3IHogbSAtMi4xMjMxNTksMy42NjUwNzQgcSAwLjI4MjU0OSwtMC42NTM5MDEgMC4zNzk0MjQsLTEuNTMzODQxIDAuMTA0OTQ3LC0wLjg4ODAxNCAwLjEwNDk0NywtMi4xMzEyMzMgMCwtMS4yMjcwNzMgLTAuMTA0OTQ3LC0yLjEzMTIzMyAtMC4wOTY4NywtMC45MDQxNTkgLTAuMzg3NDk3LC0xLjUzMzg0MiAtMC4yODI1NSwtMC42MjE2MDkgLTAuNzc0OTk0LC0wLjkzNjQ1IC0wLjQ4NDM3MSwtMC4zMTQ4NDEgLTEuMjUxMjkyLC0wLjMxNDg0MSAtMC43NTg4NDgsMCAtMS4yNTkzNjUsMC4zMTQ4NDEgLTAuNDkyNDQ0LDAuMzE0ODQxIC0wLjc4MzA2NiwwLjk1MjU5NiAtMC4yNzQ0NzcsMC41OTczOTEgLTAuMzc5NDI0LDEuNTU4MDYgLTAuMDk2ODcsMC45NjA2NyAtMC4wOTY4NywyLjEwNzAxNSAwLDEuMjU5MzY0IDAuMDg4OCwyLjEwNzAxNCAwLjA4ODgsMC44NDc2NDkgMC4zNzk0MjQsMS41MTc2OTYgMC4yNjY0MDQsMC42Mjk2ODIgMC43NTA3NzUsMC45NjA2NjkgMC40OTI0NDQsMC4zMzA5ODcgMS4yOTk3MjksMC4zMzA5ODcgMC43NTg4NDgsMCAxLjI1OTM2NSwtMC4zMTQ4NDEgMC41MDA1MTcsLTAuMzE0ODQxIDAuNzc0OTk0LC0wLjk1MjU5NyB6IgogICAgICAgc3R5bGU9ImZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXNpemU6MTYuNTMzMnB4O2ZvbnQtZmFtaWx5OidTYW5zIFNlcmlmJzt0ZXh0LWFuY2hvcjpzdGFydDttaXgtYmxlbmQtbW9kZTpub3JtYWw7ZmlsbDojZmZmZmZmO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQxMzMzO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowIgogICAgICAgaWQ9InBhdGg4NjAiIC8+CiAgPC9nPgo8L3N2Zz4K';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iMzcuMjUiCiAgIGhlaWdodD0iNDIuMjIzNzMiCiAgIHZpZXdCb3g9IjAsMCwzNy4yNSw0Mi4yMjM3MyIKICAgaWQ9InN2ZzE0IgogICBzb2RpcG9kaTpkb2NuYW1lPSIwNjUyNTMyZDcwMWNiMTNhMmU3OTdjMGIwNDIzYjUwZS5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMC4yLTIgKGU4NmM4NzA4NzksIDIwMjEtMDEtMTUpIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyMCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczE4IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTg1OCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDU3IgogICAgIGlkPSJuYW1lZHZpZXcxNiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMjEuMDc4MTk2IgogICAgIGlua3NjYXBlOmN4PSIxOC42MjUiCiAgICAgaW5rc2NhcGU6Y3k9IjMzLjczMTU0IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcxNCIgLz4KICA8ZwogICAgIGlkPSJnODcyIj4KICAgIDxwYXRoCiAgICAgICBkPSJNIDAsMzYuODU0NjQgQyAwLDI5LjA2MjI5IDAsMTAuMjU4MTUgMCw2LjEwNDY0IDAsNC41MTU3OCAxLjU2MDI3LDMuMDAzMDggMy4xODc1LDMuMDAzMDggYyA0LjIyNjQ3LDAgMjMuMjQwMzcsMCAzMC44NzUsMCAxLjk3NDE5LDAgMy4xODc1LDEuNTgxOTcgMy4xODc1LDMuMjI2NTYgMCw0LjI3Mjc5IDAsMjMuNDg3ODkgMCwzMSAwLDEuODc3MDYgLTEuNjI5ODYsMy4wMjM0NCAtMy4zMTI1LDMuMDIzNDQgLTQuMjUyMjIsMCAtMjIuOTQ0NTYsMCAtMzAuNjI1LDAgQyAxLjI2NDkyLDQwLjI1MzA4IDAsMzguOTUzMTkgMCwzNi44NTQ2NCBaIgogICAgICAgZmlsbD0iIzMxOWJmZiIKICAgICAgIHN0cm9rZT0iIzMxOWJmZiIKICAgICAgIHN0cm9rZS13aWR0aD0iMCIKICAgICAgIGlkPSJwYXRoMiIKICAgICAgIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpub3JtYWw7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjAiIC8+CiAgICA8cGF0aAogICAgICAgZD0ibSAxNS45NzYxMjcsMTEuOTY1MzY1IHEgMCwzLjIzNzIxMyAtMS4wMTcxNzksNC43NTQ5MDkgLTEuMDA5MTA2LDEuNTA5NjIzIC0zLjE0MDMzOSwxLjUwOTYyMyAtMi4xNjM1MjQyLDAgLTMuMTY0NTU3NywtMS41MzM4NDEgLTAuOTkyOTYwNywtMS41MzM4NDIgLTAuOTkyOTYwNywtNC43MTQ1NDUgMCwtMy4yMDQ5MjIzIDEuMDA5MTA2NCwtNC43MzA2OTEyIDEuMDA5MTA2NCwtMS41MzM4NDE4IDMuMTQ4NDEyLC0xLjUzMzg0MTggMi4xNjM1MjQsMCAzLjE1NjQ4NSwxLjU1ODA2MDMgMS4wMDEwMzMsMS41NDk5ODc1IDEuMDAxMDMzLDQuNjkwMzI2NyB6IG0gLTIuMTIzMTYsMy42NjUwNzQgcSAwLjI4MjU1LC0wLjY1MzkwMSAwLjM3OTQyNCwtMS41MzM4NDEgMC4xMDQ5NDgsLTAuODg4MDE0IDAuMTA0OTQ4LC0yLjEzMTIzMyAwLC0xLjIyNzA3MyAtMC4xMDQ5NDgsLTIuMTMxMjMyOCBRIDE0LjEzNTUxNyw4LjkyOTk3MjggMTMuODQ0ODk1LDguMzAwMjkwNCAxMy41NjIzNDUsNy42Nzg2ODA5IDEzLjA2OTkwMSw3LjM2MzgzOTcgMTIuNTg1NTMsNy4wNDg5OTg1IDExLjgxODYwOSw3LjA0ODk5ODUgcSAtMC43NTg4NDgsMCAtMS4yNTkzNjUsMC4zMTQ4NDEyIC0wLjQ5MjQ0NCwwLjMxNDg0MTIgLTAuNzgzMDY2NCwwLjk1MjU5NjQgLTAuMjc0NDc2OSwwLjU5NzM5MSAtMC4zNzk0MjQsMS41NTgwNjAzIC0wLjA5Njg3NCwwLjk2MDY2OTYgLTAuMDk2ODc0LDIuMTA3MDE0NiAwLDEuMjU5MzY0IDAuMDg4ODAxLDIuMTA3MDE0IDAuMDg4ODAxLDAuODQ3NjQ5IDAuMzc5NDI0LDEuNTE3Njk2IDAuMjY2NDA0NCwwLjYyOTY4MiAwLjc1MDc3NTQsMC45NjA2NjkgMC40OTI0NDQsMC4zMzA5ODcgMS4yOTk3MjksMC4zMzA5ODcgMC43NTg4NDgsMCAxLjI1OTM2NSwtMC4zMTQ4NDEgMC41MDA1MTcsLTAuMzE0ODQxIDAuNzc0OTkzLC0wLjk1MjU5NyB6IgogICAgICAgc3R5bGU9ImZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXNpemU6MTYuNTMzMnB4O2ZvbnQtZmFtaWx5OidTYW5zIFNlcmlmJzt0ZXh0LWFuY2hvcjpzdGFydDttaXgtYmxlbmQtbW9kZTpub3JtYWw7ZmlsbDojZmZmZmZmO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQxMzMzO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowIgogICAgICAgaWQ9InBhdGg4NTQiIC8+CiAgICA8cGF0aAogICAgICAgZD0ibSAzMS42MjkzODYsMTcuOTc5NjM5IGggLTYuNTA2NzE4IHYgLTEuMjI3MDczIGggMi41MDI1ODQgViA4LjY5NTg2MDEgSCAyNS4xMjI2NjggViA3LjU5Nzk1MjQgcSAwLjUwODU4OSwwIDEuMDg5ODM1LC0wLjA4MDcyOCAwLjU4MTI0NSwtMC4wODg4MDEgMC44Nzk5NCwtMC4yNTAyNTg0IDAuMzcxMzUyLC0wLjIwMTgyMTMgMC41ODEyNDYsLTAuNTA4NTg5NyAwLjIxNzk2NywtMC4zMTQ4NDExIDAuMjUwMjU4LC0wLjgzOTU3NjUgaCAxLjI1MTI5MiBWIDE2Ljc1MjU2NiBoIDIuNDU0MTQ3IHoiCiAgICAgICBzdHlsZT0iZm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc2l6ZToxNi41MzMycHg7Zm9udC1mYW1pbHk6J1NhbnMgU2VyaWYnO3RleHQtYW5jaG9yOnN0YXJ0O21peC1ibGVuZC1tb2RlOm5vcm1hbDtmaWxsOiNmZmZmZmY7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNDEzMzM7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjAiCiAgICAgICBpZD0icGF0aDg1NiIgLz4KICAgIDxwYXRoCiAgICAgICBkPSJNIDE1LjMwNjA4MSwzNy4wNTQ4MTkgSCA4Ljc5OTM2MjYgViAzNS44Mjc3NDYgSCAxMS4zMDE5NDYgViAyNy43NzEwNCBIIDguNzk5MzYyNiB2IC0xLjA5NzkwOCBxIDAuNTA4NTg5NiwwIDEuMDg5ODM0OSwtMC4wODA3MyAwLjU4MTI0NTUsLTAuMDg4OCAwLjg3OTk0MDUsLTAuMjUwMjU4IDAuMzcxMzUxLC0wLjIwMTgyMiAwLjU4MTI0NiwtMC41MDg1OSAwLjIxNzk2NywtMC4zMTQ4NDEgMC4yNTAyNTgsLTAuODM5NTc3IGggMS4yNTEyOTIgdiAxMC44MzM3NjcgaCAyLjQ1NDE0NyB6IgogICAgICAgc3R5bGU9ImZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXNpemU6MTYuNTMzMnB4O2ZvbnQtZmFtaWx5OidTYW5zIFNlcmlmJzt0ZXh0LWFuY2hvcjpzdGFydDttaXgtYmxlbmQtbW9kZTpub3JtYWw7ZmlsbDojZmZmZmZmO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQxMzMzO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowIgogICAgICAgaWQ9InBhdGg4NTgiIC8+CiAgICA8cGF0aAogICAgICAgZD0ibSAzMi4yOTk0MzIsMzEuMDQwNTQ1IHEgMCwzLjIzNzIxMyAtMS4wMTcxNzksNC43NTQ5MDkgLTEuMDA5MTA2LDEuNTA5NjIzIC0zLjE0MDMzOSwxLjUwOTYyMyAtMi4xNjM1MjQsMCAtMy4xNjQ1NTgsLTEuNTMzODQxIC0wLjk5Mjk2LC0xLjUzMzg0MiAtMC45OTI5NiwtNC43MTQ1NDUgMCwtMy4yMDQ5MjIgMS4wMDkxMDYsLTQuNzMwNjkxIDEuMDA5MTA3LC0xLjUzMzg0MiAzLjE0ODQxMiwtMS41MzM4NDIgMi4xNjM1MjQsMCAzLjE1NjQ4NSwxLjU1ODA2IDEuMDAxMDMzLDEuNTQ5OTg4IDEuMDAxMDMzLDQuNjkwMzI3IHogbSAtMi4xMjMxNTksMy42NjUwNzQgcSAwLjI4MjU0OSwtMC42NTM5MDEgMC4zNzk0MjQsLTEuNTMzODQxIDAuMTA0OTQ3LC0wLjg4ODAxNCAwLjEwNDk0NywtMi4xMzEyMzMgMCwtMS4yMjcwNzMgLTAuMTA0OTQ3LC0yLjEzMTIzMyAtMC4wOTY4NywtMC45MDQxNTkgLTAuMzg3NDk3LC0xLjUzMzg0MiAtMC4yODI1NSwtMC42MjE2MDkgLTAuNzc0OTk0LC0wLjkzNjQ1IC0wLjQ4NDM3MSwtMC4zMTQ4NDEgLTEuMjUxMjkyLC0wLjMxNDg0MSAtMC43NTg4NDgsMCAtMS4yNTkzNjUsMC4zMTQ4NDEgLTAuNDkyNDQ0LDAuMzE0ODQxIC0wLjc4MzA2NiwwLjk1MjU5NiAtMC4yNzQ0NzcsMC41OTczOTEgLTAuMzc5NDI0LDEuNTU4MDYgLTAuMDk2ODcsMC45NjA2NyAtMC4wOTY4NywyLjEwNzAxNSAwLDEuMjU5MzY0IDAuMDg4OCwyLjEwNzAxNCAwLjA4ODgsMC44NDc2NDkgMC4zNzk0MjQsMS41MTc2OTYgMC4yNjY0MDQsMC42Mjk2ODIgMC43NTA3NzUsMC45NjA2NjkgMC40OTI0NDQsMC4zMzA5ODcgMS4yOTk3MjksMC4zMzA5ODcgMC43NTg4NDgsMCAxLjI1OTM2NSwtMC4zMTQ4NDEgMC41MDA1MTcsLTAuMzE0ODQxIDAuNzc0OTk0LC0wLjk1MjU5NyB6IgogICAgICAgc3R5bGU9ImZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXNpemU6MTYuNTMzMnB4O2ZvbnQtZmFtaWx5OidTYW5zIFNlcmlmJzt0ZXh0LWFuY2hvcjpzdGFydDttaXgtYmxlbmQtbW9kZTpub3JtYWw7ZmlsbDojZmZmZmZmO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQxMzMzO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowIgogICAgICAgaWQ9InBhdGg4NjAiIC8+CiAgPC9nPgo8L3N2Zz4K';

const ShiftParam = {
    Left: "left",
    Right: "right"
};

/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3NewBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }

    _initShiftParam() {
        return [
            {
                text: 'left',
                value: ShiftParam.Left
            },
            {
                text: 'right',
                value: ShiftParam.Right
            }
        ];
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'bitOps',
            name: 'Bitwise Operators',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'bitAnd',
                    blockType: BlockType.REPORTER,
                    text: '[LEFT] and [RIGHT]',
                    arguments: {
                        LEFT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        RIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },
                {
                    opcode: 'bitOr',
                    blockType: BlockType.REPORTER,
                    text: '[LEFT] or [RIGHT]',
                    arguments: {
                        LEFT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        RIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },
                {
                    opcode: 'bitXor',
                    blockType: BlockType.REPORTER,
                    text: '[LEFT] xor [RIGHT]',
                    arguments: {
                        LEFT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        RIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },
                {
                    opcode: 'bitInv',
                    blockType: BlockType.REPORTER,
                    text: 'invert [VALUE]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },
                {
                    opcode: 'bitSft',
                    blockType: BlockType.REPORTER,
                    text: 'Shift [VALUE] for [SHIFT] bits to [SFTTO]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        SHIFT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        SFTTO: {
                            type: ArgumentType.STRING,
                            menu: 'shiftParam',
                            defaultValue: ShiftParam.Left
                        }
                    }
                },
                '---',
                {
                    opcode: 'bitRebase',
                    blockType: BlockType.REPORTER,
                    text: 'Rebase [VALUE] to [BASETO]',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        BASETO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "2"
                        }
                    }
                }
            ],
            menus: {
                shiftParam: {
                    acceptReporters: true,
                    items: this._initShiftParam()
                }
            }
        };
    }

    /**
     * Write log.
     * @param {object} args - the block arguments.
     * @return {number} 
     */
    bitAnd(args) {
        const ans = Cast.toNumber(args.LEFT) & Cast.toNumber(args.RIGHT);
        console.log("and " + Cast.toNumber(args.LEFT) + "," + Cast.toNumber(args.RIGHT));
        return ans;
    }
    bitOr(args) {
        const ans = Cast.toNumber(args.LEFT) | Cast.toNumber(args.RIGHT);
        console.log("or " + Cast.toNumber(args.LEFT) + "," + Cast.toNumber(args.RIGHT));
        return ans;
    }
    bitXor(args) {
        const ans = Cast.toNumber(args.LEFT) ^ Cast.toNumber(args.RIGHT);
        console.log("xor " + Cast.toNumber(args.LEFT) + "," + Cast.toNumber(args.RIGHT));
        return ans;
    }
    bitInv(args) {
        const ans = ~Cast.toNumber(args.VALUE);
        console.log("invert " + Cast.toNumber(args.VALUE));
        return ans;
    }
    bitSft(args) {
        var lr = args.SFTTO == ShiftParam.Left;
        if (lr) {
            const ans = Cast.toNumber(args.VALUE) << Cast.toNumber(args.SHIFT);
            console.log("lshift " + Cast.toNumber(args.VALUE) + "," + Cast.toNumber(args.SHIFT));
            return ans;
        } else {
            const ans = Cast.toNumber(args.VALUE) >> Cast.toNumber(args.SHIFT);
            console.log("rshift " + Cast.toNumber(args.VALUE) + "," + Cast.toNumber(args.SHIFT));
            return ans;
        }
    }
    bitRebase(args) {
        const ans = Cast.toNumber(args.VALUE).toString(Cast.toNumber(args.BASETO));
        console.log("rebase " + Cast.toNumber(args.VALUE) + "," + "Cast.toNumber(args.BASETO)");
        return ans;
    }
}

module.exports = Scratch3NewBlocks;