 #include <stdio.h>
       #include <stdlib.h>
       #include <string.h>
       #include <sys/wait.h>
       #include <unistd.h>

       int
       main()
       {
           pid_t  cpid;

           cpid = fork();
           if (cpid == -1) {
               perror("fork");
               exit(EXIT_FAILURE);
          }

           if (cpid == 0) { 
                //sleep(5);
                printf("This is a child process\n");
                printf("The child process id is: %d\n",getpid());
                printf("The parent process id is: %d\n",getppid());
                sleep(5);
                printf("This is a child process\n");
                printf("The child process id is: %d\n",getpid());
                printf("The new parent process id is: %d\n",getppid());
           } else { 
                sleep(1);
            	printf("This is a parent process\n");
           }
       }
