export function storageDBKey(project) {
  return project.storage_databases[0].input_directory;
}
export function sharePath(project) {
  return '/i2g-data-working/I2G_Storage_Bucket/PVEP_Block_0102/' + storageDBKey(project);
}
export function shareName(project, owner) {
  return `codb_${owner}_${project.name}`;
}
export function normalize(username) {
  let regex = new RegExp("^" + window.$siteConfig.usernamePrefix);
  // return username.replace(/^bdpoc_/, '');
  return username.replace(regex, '');
}
