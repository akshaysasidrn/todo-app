# Adapter Pattern Implementation for NestJS and React

## Introduction

This project demonstrates a Proof of Concept (PoC) for implementing the Adapter Pattern in a full-stack application using NestJS for the backend and React for the frontend. The primary goal is to showcase how to structure a project that supports both Community Edition (CE) and Enterprise Edition (EE) versions of the software, with the EE codebase extending the CE functionality.

## Project Structure

```
.
├── README.md
├── frontend
│   ├── ee (git submodule)
│   │   └── src
│   │       └── components
│   │           └── todo
│   │               └── TodoList.ee.tsx
│   ├── src
│   │   ├── components
│   │   │   ├── helpers
│   │   │   │   └── withEditionLoader.tsx
│   │   │   └── todo
│   │   │       ├── TodoList.ce.tsx
│   │   │       ├── TodoList.tsx
│   │   │       └── TodoListProps.tsx
│   └── ...
├── server
│   ├── ee (git submodule)
│   │   └── src
│   │       └── todo
│   │           └── todo.service.ee.ts
│   ├── src
│   │   ├── helpers
│   │   │   └── adapter.helper.ts
│   │   └── todo
│   │       ├── todo.service.ce.ts
│   │       ├── todo.service.ts
│   │       └── types.ts
│   └── ...
└── ...
```
## Git Submodules

Git submodules to manage the Enterprise Edition (EE) code. The `.gitmodules` file in the root of the repository defines these submodules:

```
[submodule "server/ee"]
	path = server/ee
	url = https://github.com/akshaysasidrn/todo-server-submodule.git
	branch = main
[submodule "frontend/ee"]
	path = frontend/ee
	url = https://github.com/akshaysasidrn/todo-frontend-submodule.git
	branch = main
```

### Submodule Repositories

- Server EE: [https://github.com/akshaysasidrn/todo-server-submodule](https://github.com/akshaysasidrn/todo-server-submodule)
- Frontend EE: [https://github.com/akshaysasidrn/todo-frontend-submodule](https://github.com/akshaysasidrn/todo-frontend-submodule)


## Implementation Details

### 1. Adapter Pattern Implementation

#### Backend (NestJS)

The backend uses a dynamic import mechanism to load the appropriate service implementation based on the edition (CE or EE).

Key files:
- `server/src/helpers/adapter.helper.ts`: Contains the logic for dynamically loading the correct implementation.
- `server/src/todo/types.ts`: Defines the interface (`ITodoService`) that both CE and EE implementations must adhere to.
- `server/src/todo/todo.service.ts`: The main service that uses the adapter helper to load the correct implementation.
- `server/src/todo/todo.service.ce.ts`: CE implementation of the todo service.
- `server/ee/src/todo/todo.service.ee.ts`: EE implementation of the todo service (in the EE submodule).

Example of dynamic loading (simplified):

```typescript
// adapter.helper.ts
export async function loadImplementation<T>(
  loadDir: string,
  implementationFile: string,
): Promise<T> {
  const edition = process.env.EDITION || 'ce';
  const importPath = `@${edition}/${loadDir}/${implementationFile}.${edition}`;
  const module = await import(importPath);
  return module.default;
}

// todo.service.ts
@Injectable()
export class TodoService implements OnModuleInit {
  private implementation: ITodoService;

  async onModuleInit() {
    this.implementation = await loadImplementation(__dirname, 'todo.service');
  }

  // Methods delegating to the implementation
  // ...
}
```

#### Frontend (React)

The frontend uses a Higher-Order Component (HOC) to dynamically load the correct component implementation based on the edition.

Key files:
- `frontend/src/components/helpers/withEditionLoader.tsx`: HOC for dynamic component loading.
- `frontend/src/components/todo/TodoList.tsx`: Main component that uses the HOC.
- `frontend/src/components/todo/TodoList.ce.tsx`: CE implementation of the TodoList component.
- `frontend/ee/src/components/todo/TodoList.ee.tsx`: EE implementation of the TodoList component (in the EE submodule).

Example of dynamic loading (simplified):

```typescript
// withEditionLoader.tsx
export async function loadComponent<T>(
  loadDir: string,
  fileName: string,
): Promise<React.ComponentType<T>> {
  const edition = process.env.REACT_APP_EDITION || 'ce';
  const module = await import(`@${edition}/components/${loadDir}/${fileName}.${edition}`);
  return module.default;
}

function withEditionLoader<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  { loadDir, fileName }: WithEditionLoaderProps
) {
  return function WithEditionLoader(props: T) {
    const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);

    useEffect(() => {
      loadComponent<T>(loadDir, fileName).then(setComponent);
    }, []);

    if (!Component) return <div>Loading...</div>;

    return <Component {...props} />;
  };
}

// TodoList.tsx
export default withEditionLoader(TodoList, { loadDir: 'todo', fileName: 'TodoList' });
```

### 2. Tooling Changes

1. **Git Submodules**: EE code is managed in separate private repositories and included as git submodules in the main CE repository.

2. **NPM Workspaces**: Used to manage dependencies across CE and EE codebases. This allows for separate `package.json` files in the EE submodules while still sharing dependencies with the main project.

3. **Lerna (Optional)**: Can be integrated on top of NPM workspaces for additional monorepo management features.

### 3. Code Structure

- Interface-driven development ensures consistency between CE and EE implementations.
- Edition-specific code is kept in separate directories (CE in the main repo, EE in submodules).
- Behavior selection is based on environment variables or license checks.

### 4. Development Workflow

#### CE Development
- Developers can clone the main repository and work on it as usual.
- No need to initialize submodules for CE-only development.

#### EE Development
1. Clone the main repository.
2. Initialize and update submodules:
   ```
   git submodule update --init --recursive
   ```
3. Follow the branch naming convention: use the same branch name across CE and EE repositories for related features.
4. When submitting changes, create separate PRs for CE and EE repositories.

### 5. Deployment Changes

#### CE Deployment
- No changes required from standard deployment practices.

#### EE Deployment
- Dockerfiles need to be modified to handle submodule initialization:
  ```dockerfile
  # Example Dockerfile snippet
  FROM node:14
  WORKDIR /app
  COPY . .
  RUN git submodule update --init --recursive
  RUN npm install
  RUN npm run build
  # ... rest of the Dockerfile
  ```
- For preview environments, use branch-based builds to ensure the correct EE code is included.

## Setup Instructions

1. Clone the main repository:
   ```
   git clone https://github.com/akshaysasidrn/todo-app.git
   ```

2. For EE development, initialize submodules:
   ```
   git submodule update --init --recursive
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in both `frontend` and `server` directories.
   - Set `EDITION=ce` or `EDITION=ee` as needed.

5. Run the application:
   ```
   npm run start
   ```

## Development Guidelines

1. **Branch Naming**: Use consistent branch names across CE and EE repositories for related features (e.g., `feature/new-todo-filter`).

2. **Code Organization**:
   - Keep edition-specific code in separate files with `.ce.ts` or `.ee.ts` extensions.
   - Use interfaces to ensure consistency between implementations.

## Git Submodules

This project uses Git submodules to manage the Enterprise Edition (EE) code. The `.gitmodules` file in the root of the repository defines these submodules:

```
[submodule "server/ee"]
	path = server/ee
	url = https://github.com/akshaysasidrn/todo-server-submodule.git
[submodule "frontend/ee"]
	path = frontend/ee
	url = https://github.com/akshaysasidrn/todo-frontend-submodule.git
```

### Why Submodules?

Git submodules are used in this project for several reasons:

1. **Code Separation**: Submodules allow us to keep the Enterprise Edition code separate from the Community Edition code. This separation is crucial for maintaining a clear distinction between open-source and proprietary features.

2. **Access Control**: By keeping EE code in separate repositories, we can implement stricter access controls, ensuring that only authorized developers can access and modify the EE codebase.

3. **Version Management**: Submodules enable us to manage different versions of the EE code independently from the main repository. This allows for more flexible version control and release management between CE and EE editions.

4. **Simplified Open Source Distribution**: The main repository can be easily distributed as the Community Edition without the EE code, simplifying the open-source release process.

5. **Modular Development**: Submodules support a modular approach to development, allowing teams to work on CE and EE features independently when necessary.

### Version Control with Submodules

When working with submodules, it's important to understand how version control operates:

1. **Separate Repositories**: Each submodule is a separate Git repository. This means it has its own commit history, branches, and tags.

2. **Pointer in Main Repository**: The main repository doesn't contain the actual code of the submodule. Instead, it stores a pointer to a specific commit in the submodule's repository.

3. **Updating Submodules**: When you make changes in a submodule:
   - Commit and push these changes in the submodule repository.
   - In the main repository, you'll see the submodule as "modified".
   - You need to commit this change in the main repository to update the pointer.

4. **Checking Out**: When another developer clones or pulls the main repository, they need to explicitly initialize and update the submodules to get their contents.

5. **Branching**: The main repository and each submodule can be on different branches. This allows for flexible version management between CE and EE code.

### Submodules vs. Subtrees for Private Code

In our project, where the CE code is public and the EE code is private, the choice between submodules and subtrees is crucial. Let's clarify how each approach works with private code:

1. **Submodules (Our Current Approach)**:
   - Keep EE code in separate private repositories
   - Main (public) repository only contains references to these private repositories
   - Developers need appropriate access to clone EE submodules
   - Allows for clear separation between public CE and private EE code
   - Easier to maintain different access rights for CE and EE code
   - Enables independent versioning of EE code

2. **Subtrees**:
   - Merge private EE code directly into the main repository
   - Once merged, EE code becomes part of the main repository's history
   - Cannot be used to keep EE code private if the main repo is public
   - Provides a unified view of the codebase, but compromises privacy of EE code
   - Simplifies the clone process, but complicates keeping EE code separate and private

For our use case, where maintaining the privacy of EE code is crucial, submodules are the appropriate choice. Subtrees would not work for keeping EE code private in a public CE repository.

### Why Separate Submodules for Frontend and Backend

You might wonder why we don't have a single EE submodule containing both frontend and backend code. 

Git submodules can only point to a whole repository, not to a specific directory within a repository. This limitation prevents us from having a single EE repo with separate directories for frontend and backend that we could use as submodules.

#### Typical Developer Workflow

Here's a step-by-step guide for a typical workflow when developing a feature that spans both CE and EE code:

1. **Create Feature Branches**:
   - In the main repository (CE):
     ```bash
     git checkout -b feature/new-feature
     ```
   - In each EE submodule:
     ```bash
     cd frontend/ee  # or server/ee
     git checkout -b feature/new-feature
     cd ../..  # return to main repo root
     ```

2. **Make Changes**:
   - Edit files in both CE and EE code as needed.
   - Commit changes in submodules first:
     ```bash
     cd frontend/ee  # or server/ee
     git add .
     git commit -m "Implement EE part of new feature"
     cd ../..
     ```
   - Then commit changes in the main repo, including submodule updates:
     ```bash
     git add .
     git commit -m "Implement CE part of new feature and update EE submodules"
     ```

3. **Push Changes**:
   - Push submodule changes first:
     ```bash
     cd frontend/ee  # or server/ee
     git push origin feature/new-feature
     cd ../..
     ```
   - Then push main repo changes:
     ```bash
     git push origin feature/new-feature
     ```

4. **Open Pull Requests**:
   - Open a PR for each EE submodule where changes were made.
   - Open a PR for the main CE repository.
   - In the main repo PR description, reference the related EE PRs.

5. **Review and Merge**:
   - PRs should be reviewed and merged in the following order:
     1. EE submodule PRs
     2. Main CE repository PR

6. **Update Main Repo After EE Merges**:
   - If EE PRs are merged before the CE PR:
     ```bash
     git checkout feature/new-feature
     git submodule update --remote
     git add .
     git commit -m "Update EE submodules to latest merged version"
     git push origin feature/new-feature
     ```

7. **Cleanup**:
   - After all PRs are merged, delete the feature branches in both the main repo and submodules.

Remember to keep the CE and EE parts of your feature in sync by using consistent branch names across repositories. This workflow ensures that changes in both CE and EE codebases are properly tracked and can be reviewed together.

### CI Build Process

To demonstrate how our submodule structure and branch naming conventions are utilized in the CI/CD pipeline, here's an example Dockerfile that could be used for building the Enterprise Edition (EE) of the application:

```dockerfile
# Use a base image with Node.js pre-installed
FROM node:14 AS builder

# Set the working directory
WORKDIR /app

# Install Git
RUN apt-get update && apt-get install -y git

# Clone the main repository
ARG GITHUB_TOKEN
ARG BRANCH_NAME=main
RUN git clone https://x-access-token:${GITHUB_TOKEN}@github.com/your-org/your-repo.git .
RUN git checkout ${BRANCH_NAME}

# Initialize and update submodules
RUN git submodule update --init --recursive

# Checkout the same branch in submodules if it exists, otherwise stay on default branch
RUN git submodule foreach 'git checkout $BRANCH_NAME || true'

# Install dependencies and build the server
WORKDIR /app/server
RUN npm ci
RUN npm run build

# Install dependencies and build the frontend
WORKDIR /app/frontend
RUN npm ci
RUN npm run build

# Use a smaller base image for the final image
FROM node:14-slim

# Set the working directory
WORKDIR /app

# Copy built artifacts from the builder stage
COPY --from=builder /app/server/dist /app/server/dist
COPY --from=builder /app/server/node_modules /app/server/node_modules
COPY --from=builder /app/frontend/build /app/frontend/build

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server/dist/main.js"]
```

#### Key Points About This Dockerfile:

1. **Multi-stage Build**: We use a multi-stage build to keep the final image size small. The `builder` stage compiles the code, while the final stage only contains the necessary runtime files.

2. **Dynamic Branch Checkout**: The `BRANCH_NAME` build argument allows us to specify which branch to build, ensuring consistency across the main repo and submodules.

3. **Submodule Handling**: 
   - We initialize and update submodules to ensure all necessary code is present.
   - We attempt to checkout the same branch in submodules as in the main repository.

4. **GitHub Token**: The `GITHUB_TOKEN` is used to clone the private EE repositories. This token should have access to all necessary repositories.

5. **Building Both Frontend and Backend**: The Dockerfile builds both the server (NestJS) and frontend (React) applications.

#### Using This Dockerfile in CI:

To use this Dockerfile in your CI pipeline, you might have a step like this:

```yaml
build:
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Build Docker image
      env:
        GITHUB_TOKEN: ${{ secrets.GH_PAT }}
      run: |
        docker build \
          --build-arg GITHUB_TOKEN=${GITHUB_TOKEN} \
          --build-arg BRANCH_NAME=${GITHUB_REF##*/} \
          -t your-org/your-app:${GITHUB_SHA} .

    - name: Push Docker image
      run: docker push your-org/your-app:${GITHUB_SHA}
```

This CI configuration does the following:
1. Checks out the code.
2. Builds the Docker image, passing in the GitHub token and the current branch name.
3. Tags the image with the commit SHA for unique identification.
4. Pushes the built image to your container registry.

By using this approach, you ensure that:
- The correct version of both CE and EE code is always built together.
- Branch naming conventions are respected in the build process.
- The build process is consistent across all environments.

Remember to secure your `GITHUB_TOKEN` and any other sensitive information by using your CI platform's secrets management feature.

## Conclusion

This Adapter Pattern implementation provides a flexible and maintainable approach to managing CE and EE versions of the application. It allows for clear separation of concerns, easier maintenance, and a simplified open-source contribution process for the CE version.

Key benefits:
- Clear separation of CE and EE code
- Simplified management of different editions
- Streamlined development process for both CE and EE contributors

Potential challenges:
- Learning curve for new developers
- Increased complexity in build and deployment processes
- Maintaining consistency across editions
