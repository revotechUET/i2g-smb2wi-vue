export function storageDBKey(project) {
  return project.storage_databases[0].input_directory;
}
export function sharePath(project) {
  return '/i2g_data/minio_data/I2G_Storage_Bucket/BDPOC/' + storageDBKey(project);
}
export function shareName(project, owner) {
  return `codb_${owner}_${project.name}`;
}
export function normalize(username) {
  return username;
}
