import * as cluster from 'cluster';
import * as os from 'os';
 
export function runInCluster(
  bootstrap: () => Promise<void>
) {
  const numberOfCores = os.cpus().length;
 
  if ((cluster as any).isPrimary) {
    //  use numberOfCores for prod instead of 1 static 
    for (let i = 0; i < 1; ++i) {
      (cluster as any).fork();
    }
  } else {
    bootstrap();
  }
}