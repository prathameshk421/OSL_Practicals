/* Exp 5b: Reader-Writer problem (readers-preference) using mutex + semaphore.
Many readers may read together; a writer needs exclusive access. */
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
sem_t wrt; /* gives a writer exclusive access */
pthread_mutex_t rcmutex; /* protects readcount */
int readcount = 0;
int shared_data = 0;

void *reader(void *arg) {
int id = *(int *)arg;
pthread_mutex_lock(&rcmutex);
readcount++;
if (readcount == 1) sem_wait(&wrt); /* first reader locks writers out */
pthread_mutex_unlock(&rcmutex);
printf("Reader %d reads data = %d (active readers = %d)\n",
id, shared_data, readcount);
usleep(50000);
pthread_mutex_lock(&rcmutex);
readcount--;
if (readcount == 0) sem_post(&wrt); /* last reader frees writers */
pthread_mutex_unlock(&rcmutex);
return NULL;
}

void *writer(void *arg) {
int id = *(int *)arg;
sem_wait(&wrt); /* exclusive access */
shared_data += 10;
printf("Writer %d WROTE data = %d (exclusive)\n", id, shared_data);
usleep(50000);
sem_post(&wrt);
return NULL;
}

int main() {
pthread_t r[3], w[2];
int id[5] = {1, 2, 3, 1, 2};
sem_init(&wrt, 0, 1);
pthread_mutex_init(&rcmutex, NULL);
pthread_create(&r[0], NULL, reader, &id[0]);
pthread_create(&w[0], NULL, writer, &id[3]);
pthread_create(&r[1], NULL, reader, &id[1]);
pthread_create(&r[2], NULL, reader, &id[2]);
pthread_create(&w[1], NULL, writer, &id[4]);
for (int i = 0; i < 3; i++) pthread_join(r[i], NULL);
for (int i = 0; i < 2; i++) pthread_join(w[i], NULL);
printf("Reader-Writer finished; data consistency maintained.\n");
return 0;
}
