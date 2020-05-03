
# github-action-toolkit

```bash
npm install
npm run build
```

Example use:  
```yaml
  trigger-deploy:
    runs-on: ubuntu-latest
    needs:
      - test-node
      - test-deno
    steps:
      - name: Check if package.json version have changed
        id: id1
        uses: garronej/github-actions-toolkit@master
        with: 
          action_name: is_version_changed
          owner: ${{github.repository_owner}}
          repo: ${{github.repository.name}}
          branch_current: ${{master}}
          branch_new: ${{dev}}
      - name: Trigger deploy if version changed
        if: steps.id1.outputs.is_version_changed && github.event_name == 'push'
        uses: garronej/github-actions-toolkit@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} 
        with:
          action_name: dispatch_event
          owner: ${{github.repository_owner}}
          repo: ${{github.repository.name}}
          event_type: deploy
```

