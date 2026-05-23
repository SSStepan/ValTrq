import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('valtrq', {
  platform: process.platform,
  version: '0.1.0'
});
